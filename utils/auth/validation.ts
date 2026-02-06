import { ProfileSchema } from "@/zod/schema/Profile.schema";
import z from "zod";

export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
  sanitizedUsername?: string;
} {
  try {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return {
        isValid: false,
        error: "Le nom d'utilisateur ne peut pas être vide",
      };
    }

    const validatedUsername =
      ProfileSchema.shape.userName.parse(trimmedUsername);

    return {
      isValid: true,
      sanitizedUsername: validatedUsername,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0].message,
      };
    }

    return {
      isValid: false,
      error: "Erreur de validation",
    };
  }
}

export function validateFirstAndLastname(firstAndLastName: string): {
  isValid: boolean;
  error?: string;
  sanitizedFirstAndLastname?: string;
} {
  try {
    const trimmedFirstAndLastname = firstAndLastName.trim();

    if (!trimmedFirstAndLastname) {
      return {
        isValid: false,
        error: "Le nom complet ne peut pas être vide",
      };
    }

    const validatedFirstAndLastname =
      ProfileSchema.shape.firstAndLastName.parse(trimmedFirstAndLastname);

    return {
      isValid: true,
      sanitizedFirstAndLastname: validatedFirstAndLastname,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0].message,
      };
    }

    return {
      isValid: false,
      error: "Erreur de validation",
    };
  }
}

export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
  sanitizedPassword?: string;
} {
  try {
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      return {
        isValid: false,
        error: "Le mot de passe ne peut pas être vide",
      };
    }

    const validatedPassword =
      ProfileSchema.shape.password.parse(trimmedPassword);

    return {
      isValid: true,
      sanitizedPassword: validatedPassword,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0].message,
      };
    }

    return {
      isValid: false,
      error: "Erreur de validation",
    };
  }
}

export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
  sanitizedEmail?: string;
} {
  try {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return {
        isValid: false,
        error: "L'Email ne peut pas être vide",
      };
    }

    const validatedPassword = ProfileSchema.shape.email.parse(trimmedEmail);

    return {
      isValid: true,
      sanitizedEmail: validatedPassword,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0].message,
      };
    }

    return {
      isValid: false,
      error: "Erreur de validation",
    };
  }
}
