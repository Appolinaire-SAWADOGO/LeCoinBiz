import { NotificationUtility } from '../utils/notifications/index';

// Mock modules
jest.mock('expo-device', () => ({ isDevice: true }));

const requestPermissionsAsyncMock = jest.fn();
const getPermissionsAsyncMock = jest.fn();
const scheduleNotificationAsyncMock = jest.fn();
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: () => requestPermissionsAsyncMock(),
  getPermissionsAsync: () => getPermissionsAsyncMock(),
  scheduleNotificationAsync: (args: any) => scheduleNotificationAsyncMock(args),
}));

const subscribeToTopicMock = jest.fn();
const unsubscribeFromTopicMock = jest.fn();
const getTokenMock = jest.fn();
const onMessageMock = jest.fn();
const onNotificationOpenedAppMock = jest.fn();
const getInitialNotificationMock = jest.fn();
jest.mock('@react-native-firebase/messaging', () => () => ({
  subscribeToTopic: (topic: string) => subscribeToTopicMock(topic),
  unsubscribeFromTopic: (topic: string) => unsubscribeFromTopicMock(topic),
  getToken: () => getTokenMock(),
  onMessage: (handler: any) => onMessageMock(handler),
  onNotificationOpenedApp: (handler: any) => onNotificationOpenedAppMock(handler),
  getInitialNotification: () => getInitialNotificationMock(),
}));

const firestoreSetMock = jest.fn();
const firestoreUpdateMock = jest.fn();
const collectionMock = jest.fn();
const docMock = jest.fn();
const FieldValue = {
  arrayUnion: (...args: any[]) => ({ arrayUnion: args }),
  arrayRemove: (...args: any[]) => ({ arrayRemove: args }),
  serverTimestamp: () => new Date('2020-01-01T00:00:00.000Z'),
};
jest.mock('@react-native-firebase/firestore', () => {
  const collection = (name: string) => (collectionMock(name), {
    doc: (id: string) => (docMock(id), {
      set: (data: any, options: any) => firestoreSetMock(data, options),
      update: (data: any) => firestoreUpdateMock(data),
    }),
  });
  return Object.assign(() => ({ collection }), { FieldValue });
});

const navigateMock = jest.fn();
jest.mock('expo-router', () => ({ router: { navigate: (path: string) => navigateMock(path) } }));

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

// Under test file path mapping for TS path
jest.mock('../utils/notifications/index', () => jest.requireActual('../../utils/notifications/index'));

describe('NotificationUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeviceToken', () => {
    it('should return null when permission is denied', async () => {
      (getPermissionsAsyncMock as any).mockResolvedValue({ status: 'denied' });
      (requestPermissionsAsyncMock as any).mockResolvedValue({ status: 'denied' });
      (getTokenMock as any).mockResolvedValue('abc');

      const token = await NotificationUtility.getDeviceToken();
      expect(token).toBeNull();
      expect(getTokenMock).not.toHaveBeenCalled();
    });

    it('should request permission if not granted and then return token', async () => {
      (getPermissionsAsyncMock as any).mockResolvedValue({ status: 'undetermined' });
      (requestPermissionsAsyncMock as any).mockResolvedValue({ status: 'granted' });
      (getTokenMock as any).mockResolvedValue('token-123');

      const token = await NotificationUtility.getDeviceToken();
      expect(getTokenMock).toHaveBeenCalled();
      expect(token).toBe('token-123');
    });

    it('should handle error and return null', async () => {
      (getPermissionsAsyncMock as any).mockRejectedValue(new Error('boom'));

      const token = await NotificationUtility.getDeviceToken();
      expect(token).toBeNull();
    });
  });

  describe('subscribeToGeneralTopics', () => {
    it('should subscribe to all_users and events topics', async () => {
      await NotificationUtility.subscribeToGeneralTopics();
      expect(subscribeToTopicMock).toHaveBeenNthCalledWith(1, 'all_users');
      expect(subscribeToTopicMock).toHaveBeenNthCalledWith(2, 'events');
    });

    it('should swallow errors', async () => {
      (subscribeToTopicMock as any).mockRejectedValueOnce(new Error('x'));
      await expect(NotificationUtility.subscribeToGeneralTopics()).resolves.toBeUndefined();
    });

    it('should stop after first failure and not attempt second topic subscription', async () => {
      (subscribeToTopicMock as any)
        .mockRejectedValueOnce(new Error('fail-all'));
      await expect(NotificationUtility.subscribeToGeneralTopics()).resolves.toBeUndefined();
      expect(subscribeToTopicMock).toHaveBeenNthCalledWith(1, 'all_users');
      expect(subscribeToTopicMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerUserToken', () => {
    it('should not write when token is null', async () => {
      (getPermissionsAsyncMock as any).mockResolvedValue({ status: 'denied' });
      await NotificationUtility.registerUserToken('u1');
      expect(firestoreSetMock).not.toHaveBeenCalled();
      expect(subscribeToTopicMock).not.toHaveBeenCalled();
    });

    it('should write token info and subscribe to user topic', async () => {
      (getPermissionsAsyncMock as any).mockResolvedValue({ status: 'granted' });
      (getTokenMock as any).mockResolvedValue('t-1');

      await NotificationUtility.registerUserToken('user42');
      expect(collectionMock).toHaveBeenCalledWith('UserFcmTokens');
      expect(docMock).toHaveBeenCalledWith('user42');
      expect(firestoreSetMock).toHaveBeenCalled();
      expect(subscribeToTopicMock).toHaveBeenCalledWith('user_user42');
    });

    it('should swallow errors from firestore set', async () => {
      (getPermissionsAsyncMock as any).mockResolvedValue({ status: 'granted' });
      (getTokenMock as any).mockResolvedValue('t-err');
      (firestoreSetMock as any).mockRejectedValueOnce(new Error('set-fail'));
      await expect(NotificationUtility.registerUserToken('userErr')).resolves.toBeUndefined();
      expect(subscribeToTopicMock).not.toHaveBeenCalled();
    });
  });

  describe('unregisterUserToken', () => {
    it('should remove token and unsubscribe', async () => {
      (getTokenMock as any).mockResolvedValue('t-2');

      await NotificationUtility.unregisterUserToken('userX');

      expect(collectionMock).toHaveBeenCalledWith('UserFcmTokens');
      expect(docMock).toHaveBeenCalledWith('userX');
      expect(firestoreUpdateMock).toHaveBeenCalled();
      expect(unsubscribeFromTopicMock).toHaveBeenCalledWith('user_userX');
    });

    it('should swallow errors', async () => {
      (getTokenMock as any).mockRejectedValueOnce(new Error('fail'));
      await expect(NotificationUtility.unregisterUserToken('userY')).resolves.toBeUndefined();
    });

    it('should swallow errors from firestore update', async () => {
      (getTokenMock as any).mockResolvedValue('t-3');
      (firestoreUpdateMock as any).mockRejectedValueOnce(new Error('update-fail'));
      await expect(NotificationUtility.unregisterUserToken('userZ')).resolves.toBeUndefined();
      expect(unsubscribeFromTopicMock).not.toHaveBeenCalled();
    });
  });

  describe('setupNotificationListeners', () => {
    it('should add handlers for message, opened, and initial notification', async () => {
      (getInitialNotificationMock as any).mockResolvedValue(undefined);

      NotificationUtility.setupNotificationListeners();

      expect(onMessageMock).toHaveBeenCalled();
      expect(onNotificationOpenedAppMock).toHaveBeenCalled();
      expect(getInitialNotificationMock).toHaveBeenCalled();
    });

    it('should navigate when opened from background', () => {
      (onNotificationOpenedAppMock as any).mockImplementation((handler: any) => {
        handler({ data: { type: 'event' } });
      });

      NotificationUtility.setupNotificationListeners();

      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');
    });

    it('should navigate when opened from quit state', async () => {
      (getInitialNotificationMock as any).mockResolvedValue({ data: { type: 'announcement_rejected' } });

      NotificationUtility.setupNotificationListeners();

      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');
    });
  });

  describe('handle navigation by notification type', () => {
    it('should navigate to /Notifications for supported types and default', () => {
      const any: any = NotificationUtility as any;
      const fn = any['handleNotificationNavigation'].bind(NotificationUtility);

      fn({ data: { type: 'announcement_approved' } });
      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');

      fn({ data: { type: 'announcement_rejected' } });
      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');

      fn({ data: { type: 'event' } });
      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');

      fn({ data: { type: 'unknown' } });
      expect(navigateMock).toHaveBeenLastCalledWith('/(root)/Notifications');
    });

    it('should schedule a local notification when receiving foreground message', async () => {
      // Arrange message handler and simulate invoking it
      (onMessageMock as any).mockImplementation((handler: any) => {
        handler({ notification: { title: 'Hello', body: 'World' }, data: { a: 1 } });
      });

      NotificationUtility.setupNotificationListeners();

      expect(scheduleNotificationAsyncMock).toHaveBeenCalledWith({
        content: { title: 'Hello', body: 'World', data: { a: 1 } },
        trigger: null,
      });
    });
  });
});
