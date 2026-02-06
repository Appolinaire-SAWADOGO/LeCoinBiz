import { getCurrentUserAuthMethod, checkIfUserNameIsAdded, isValidEmail, isValidPassword, initialInvalidQuery, isReservedUsername, validateUsername, validateFirstAndLastname, validatePassword } from '../utils/auth/index';
import { RESERVED_USERNAMES } from '../constants';

// Map TS path aliases used in code under test
jest.mock('../utils/auth/index', () => jest.requireActual('../../utils/auth/index'));
jest.mock('../constants', () => jest.requireActual('../../constants'));
jest.mock('../zod/schema/Profile.schema', () => jest.requireActual('../../zod/schema/Profile.schema'));

// Mocks for firebase and react-query
const getAuthMock = jest.fn();
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => getAuthMock(),
}));

const collectionMock = jest.fn();
const docMock = jest.fn();
const getMock = jest.fn();
jest.mock('@react-native-firebase/firestore', () => () => ({
  collection: (name: string) => (collectionMock(name), {
    doc: (id: string) => (docMock(id), {
      get: () => getMock(),
    }),
  }),
}));

const invalidateQueriesMock = jest.fn();
class FakeQueryClient {
  invalidateQueries = invalidateQueriesMock;
}

describe('utils/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUserAuthMethod', () => {
    it('should return providerId when user has providerData', () => {
      const user: any = { providerData: [{ providerId: 'password' }] };
      expect(getCurrentUserAuthMethod(user)).toBe('password');
    });

    it('should return undefined when no user', () => {
      expect(getCurrentUserAuthMethod(null as any)).toBeUndefined();
    });

    it('should return undefined when providerData empty', () => {
      const user: any = { providerData: [] };
      expect(getCurrentUserAuthMethod(user)).toBeUndefined();
    });
  });

  describe('checkIfUserNameIsAdded', () => {
    it('should return false when uuid is empty and log once', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = await checkIfUserNameIsAdded('');
      expect(result).toBe(false);
      expect(logSpy).toHaveBeenCalledWith('no uuid');
      logSpy.mockRestore();
    });

    it('should return false when user doc does not exist', async () => {
      (getMock as any).mockResolvedValueOnce({ exists: false });
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = await checkIfUserNameIsAdded('u1');
      expect(collectionMock).toHaveBeenCalledWith('Users');
      expect(docMock).toHaveBeenCalledWith('u1');
      expect(result).toBe(false);
      expect(logSpy).toHaveBeenCalledWith('uuid', 'u1');
      expect(logSpy).toHaveBeenCalledWith('no user');
      logSpy.mockRestore();
    });

    it('should return true when userName exists in doc data', async () => {
      (getMock as any).mockResolvedValueOnce({ exists: true, data: () => ({ userName: 'john' }) });
      const result = await checkIfUserNameIsAdded('u2');
      expect(result).toBe(true);
    });

    it('should return false when user exists but userName is missing', async () => {
      (getMock as any).mockResolvedValueOnce({ exists: true, data: () => ({}) });
      const result = await checkIfUserNameIsAdded('u3');
      expect(result).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    it('should invalidate wrong email', () => {
      expect(isValidEmail('invalid@com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate password with letter, number, special, and length between 8 and 20', () => {
      const res = isValidPassword('Aa1!aaaa');
      expect(res.ifPasswordValided).toBe(true);
      expect(res.hasLetter).toBe(true);
      expect(res.hasNumber).toBe(true);
      expect(res.hasSpecial).toBe(true);
      expect(res.hasMinLength).toBe(true);
      expect(res.hasMaxLength).toBe(true);
    });

    it('should fail when missing a number', () => {
      const res = isValidPassword('Password!');
      expect(res.ifPasswordValided).toBe(false);
      expect(res.hasNumber).toBe(false);
    });

    it('should fail when too short', () => {
      const res = isValidPassword('Aa1!a');
      expect(res.ifPasswordValided).toBe(false);
      expect(res.hasMinLength).toBe(false);
    });

    it('should fail when too long', () => {
      const res = isValidPassword('Aa1!' + 'a'.repeat(20));
      expect(res.ifPasswordValided).toBe(false);
      expect(res.hasMaxLength).toBe(false);
    });
  });

  describe('initialInvalidQuery', () => {
    it('should return early when no current user', async () => {
      (getAuthMock as any).mockReturnValueOnce({ currentUser: null });
      const qc = new FakeQueryClient() as any;
      await initialInvalidQuery(qc);
      expect(invalidateQueriesMock).not.toHaveBeenCalled();
    });

    it('should invalidate all relevant query keys when user exists', async () => {
      (getAuthMock as any).mockReturnValueOnce({ currentUser: { uid: 'user-1' } });
      const qc = new FakeQueryClient() as any;
      await initialInvalidQuery(qc);

      const calls = invalidateQueriesMock.mock.calls.map((c: any[]) => c[0]);
      expect(calls).toEqual([
        { queryKey: ['user-favorites'] },
        { queryKey: ['user', 'user-1', 'profile'] },
        { queryKey: ['user-activated-ads-count', 'user-1'] },
        { queryKey: ['user-disabled-ads-count', 'user-1'] },
        { queryKey: ['user-pending-ads-count', 'user-1'] },
        { queryKey: ['user-activated-ads', 'user-1'] },
        { queryKey: ['user-disabled-ads', 'user-1'] },
        { queryKey: ['user-pending-ads', 'user-1'] },
      ]);
    });

    it('should swallow errors and log to console.error', async () => {
      (getAuthMock as any).mockReturnValueOnce({ currentUser: { uid: 'user-2' } });
      const qc = new FakeQueryClient() as any;
      invalidateQueriesMock.mockRejectedValueOnce(new Error('fail'));
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await initialInvalidQuery(qc);
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });

  describe('isReservedUsername', () => {
    it('should detect reserved usernames case-insensitively', () => {
      for (const name of RESERVED_USERNAMES) {
        expect(isReservedUsername(name)).toBe(true);
        expect(isReservedUsername(name.toUpperCase())).toBe(true);
      }
      expect(isReservedUsername('unique_user')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it("should fail when empty and return correct message", () => {
      const r = validateUsername('   ');
      expect(r.isValid).toBe(false);
      expect(r.error).toBe("Le nom d'utilisateur ne peut pas être vide");
    });

    it('should succeed and sanitize a valid username', () => {
      const r = validateUsername('  John_Doe ');
      expect(r.isValid).toBe(true);
      expect(typeof r.sanitizedUsername).toBe('string');
    });

    it('should map zod error to error message', () => {
      const r = validateUsername('x'); // likely violates schema (too short, etc.)
      expect(r.isValid).toBe(false);
      expect(typeof r.error).toBe('string');
    });
  });

  describe('validateFirstAndLastname', () => {
    it('should fail when empty and return correct message', () => {
      const r = validateFirstAndLastname('   ');
      expect(r.isValid).toBe(false);
      expect(r.error).toBe('Le nom complet ne peut pas être vide');
    });

    it('should succeed for a valid full name', () => {
      const r = validateFirstAndLastname('  John Doe  ');
      expect(r.isValid).toBe(true);
      expect(typeof r.sanitizedFirstAndLastname).toBe('string');
    });

    it('should map zod error to error message for invalid name', () => {
      const r = validateFirstAndLastname('J');
      expect(r.isValid).toBe(false);
      expect(typeof r.error).toBe('string');
    });
  });

  describe('validatePassword', () => {
    it('should fail when empty and return correct message', () => {
      const r = validatePassword('   ');
      expect(r.isValid).toBe(false);
      expect(r.error).toBe("Le mot de passe ne peut pas être vide");
    });

    it('should succeed for a valid password that matches schema', () => {
      const r = validatePassword('Abcdef1!');
      expect(r.isValid).toBe(true);
      expect(typeof r.sanitizedPassword).toBe('string');
    });

    it('should map zod error to error message for invalid password', () => {
      const r = validatePassword('short');
      expect(r.isValid).toBe(false);
      expect(typeof r.error).toBe('string');
    });
  });
});
