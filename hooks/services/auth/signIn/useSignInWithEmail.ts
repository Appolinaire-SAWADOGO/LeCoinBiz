import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import React from "react";

export const useSignInWithEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { setUserIsLogged, setUserNameIsAdded } = useAuthStore();
    const {onClose } = useAuthModalStore();
  

  const handleSignInWithEmail = async (
    email: string,
    password: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!email || !password) return;

    setIsLoading(true);

    const resetForm = () => {
      setEmail("");
      setPassword("");
    };

    await signInWithEmailAndPassword(getAuth(), email, password)
      .then(() => {
        console.log("User account signed in!");
        setUserIsLogged(true);
        setUserNameIsAdded(true);
        onClose();
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          console.log(
            "he supplied auth credential is incorrect, malformed or has expired."
          );
          setError("Adresse e-mail ou mot de passe incorrect");
          resetForm();
        }

        console.error(error);
      });

    setIsLoading(false);
  };

  return { handleSignInWithEmail, isLoading, error, setError };
};
