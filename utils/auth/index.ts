import { RESERVED_USERNAMES } from "@/constants";
import { EditProfileSchema } from "@/zod/schema/editProfile.schema";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const ifUserIsConnected = () => {
  const auth = getAuth();
  if (auth.currentUser) return true;
  return false;
};

export const checkIfUserNameIsAdded = async (uuid: string) => {
  if (!uuid) {
    console.log("no uuid");
    return false;
  }

  console.log("uuid", uuid);

  const user = await firestore().collection("Users").doc(uuid).get();

  if (!user.exists) {
    console.log("no user");
    return false;
  }

  const userData = user.data();

  if (userData?.userName) return true;
  return false;
};

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPassword = (value: string) => {
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);
  const hasMinLength = value.length >= 8;
  const hasMaxLength = value.length <= 20;

  const ifPasswordValided =
    hasLetter && hasNumber && hasSpecial && hasMinLength && hasMaxLength;

  return {
    ifPasswordValided,
    hasLetter,
    hasNumber,
    hasSpecial,
    hasMinLength,
    hasMaxLength,
  };
};

export const initialInvalidQuery = async () => {
  const queryClient = useQueryClient();

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  if (!userId) return;

  try {
    await queryClient.invalidateQueries({ queryKey: ["user-favorites"] });

    await queryClient.invalidateQueries({
      queryKey: ["user-data", userId, "profile"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-activated-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-disabled-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-pending-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-activated-ads"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-disabled-ads"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-pending-ads"],
    });
  } catch (error) {
    console.error("Error during invalidating queries:", error);
  }
};

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

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
      EditProfileSchema.shape.userName.parse(trimmedUsername);

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
