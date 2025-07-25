import { useAuthStore } from "@/store/useAuthStore";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import { useCreateUserWithEmail } from "./useCreateUserWithEmail";

export const useSignUpWithEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { setUserNameIsAdded, setUserIsLogged } = useAuthStore();

  const { createUserWithEmail } = useCreateUserWithEmail();

  const handleSignUpWithEmail = async (
    email: string,
    password: string,
    userName: string
  ) => {
    if (!email || !password || !userName) return;

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
      router.dismiss();
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Cette adresse e-mail est déjà utilisée !");
          break;
        case "auth/invalid-email":
          setError("Cette adresse e-mail est invalide !");
          break;

        default:
          setError("Une erreur est survenue. Veuillez réessayer.");
          break;
      }

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUpWithEmail, isLoading, error, setError };
};
