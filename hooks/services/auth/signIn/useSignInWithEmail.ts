import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useVerifyEmailStore } from "@/store/useVerifyEmailStore";
import { showToast } from "@/utils";
import { isValidEmail } from "@/utils/auth";
import { subscribeToUserTopic } from "@/utils/notifications";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useGetAdsByUserId } from "../../ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "../../ads/useGetUserAdsCount";
import { useGetFavoriteAdsByUserId } from "../../favorites/useGetFavoritesAdsByUserId";
import { useGetUserById } from "../../user/useGetUserById";

export const useSignInWithEmail = () => {
  const queryClient = useQueryClient();
  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { onClose: closeAuthModal } = useAuthModalStore();
  const { open: openVerifyEmailModal } = useVerifyEmailStore();

  const handleSignInWithEmail = async (
    email: string,
    password: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!email || !isValidEmail(email) || !password) return;

    const resetForm = () => {
      setEmail("");
      setPassword("");
    };

    try {
      setIsLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );

      await subscribeToUserTopic(userCredential.user.uid!);

      setError(null);

      closeAuthModal();
      if (!userCredential.user.emailVerified) openVerifyEmailModal();

      showToast("success", "Connexion réussie !", 100);
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
