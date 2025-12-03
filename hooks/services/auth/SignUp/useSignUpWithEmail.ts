import { useAuthStore } from "@/store/useAuthStore";
import {
  initialInvalidQuery,
  isValidEmail,
  isValidPassword,
  validateUsername,
} from "@/utils/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import { useCreateUserWithEmail } from "./useCreateUserWithEmail";

export const useSignUpWithEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<{
    email: string | null;
    all: string | null;
  }>({
    email: null,
    all: null,
  });

  const handleSetError = (type: "email" | "all", msg: string | null) => {
    setError((prev) => ({
      ...prev,
      [type]: msg,
    }));
  };

  const { setUserNameIsAdded, setUserIsLogged } = useAuthStore();

  const { createUserWithEmail } = useCreateUserWithEmail();

  const handleSignUpWithEmail = async (
    email: string,
    password: string,
    userName: string
  ) => {
    if (
      !email ||
      !isValidEmail(email) ||
      !password ||
      !isValidPassword(password) ||
      !userName ||
      !validateUsername(userName).isValid ||
      !isValidPassword(userName)
    )
      return;

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      await createUserWithEmail(userName, email, userCredential.user.uid);

      setUserIsLogged(true);
      setUserNameIsAdded(true);

      handleSetError("email", null);
      handleSetError("all", null);

      await initialInvalidQuery();

      router.dismiss();
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          handleSetError(
            "email",
            "Adresse e-mail déjà utilisée par autres utilisateurs."
          );
          break;
        case "auth/invalid-email":
          handleSetError("email", "Adresse e-mail est invalide.");
          break;

        default:
          handleSetError("all", "Une erreur est survenue. Veuillez réessayer.");
          console.error("Erreur lors de la connexion avec email:", error);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUpWithEmail, isLoading, error, setError };
};
