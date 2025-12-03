import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { initialInvalidQuery, isValidEmail } from "@/utils/auth";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import React from "react";

export const useSignInWithEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { setUserIsLogged, setUserNameIsAdded } = useAuthStore();
  const { onClose } = useAuthModalStore();

  const handleSignInWithEmail = async (
    email: string,
    password: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!email || !isValidEmail(email) || !password) return;

    const resetForm = () => {
      setEmail("");
      setPassword("");
    };

    try {
      setIsLoading(true);

      await signInWithEmailAndPassword(getAuth(), email, password);

      setUserIsLogged(true);
      setUserNameIsAdded(true);

      setError(null);

      await initialInvalidQuery();

      onClose();
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Adresse e-mail ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue, veuillez réessayer.");
      }

      resetForm();
      console.log("Error l'ors de la connexion avec email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignInWithEmail, isLoading, error, setError };
};
