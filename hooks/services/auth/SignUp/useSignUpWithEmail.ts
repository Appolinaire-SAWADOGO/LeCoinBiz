import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useVerifyEmailStore } from "@/store/useVerifyEmailStore";
import { showToast } from "@/utils";
import { isValidEmail, isValidPassword } from "@/utils/auth";
import { validateUsername } from "@/utils/auth/validation";
import { authEvents } from "@/utils/EventEmitter";
import { subscribeToUserTopic } from "@/utils/notifications";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useGetAdsByUserId } from "../../ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "../../ads/useGetUserAdsCount";
import { useGetFavoriteAdsByUserId } from "../../favorites/useGetFavoritesAdsByUserId";
import { useGetUserById } from "../../user/useGetUserById";
import { useCreateUserWithEmail } from "./useCreateUserWithEmail";

export const useSignUpWithEmail = () => {
  const queryClient = useQueryClient();
  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();

  const { onClose: closeAuthModal } = useAuthModalStore();
  const { open: openVerifyEmailModal } = useVerifyEmailStore();

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

  const { createUserWithEmail } = useCreateUserWithEmail();

  const handleSignUpWithEmail = async (
    email: string,
    password: string,
    userName: string,
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
      return null;

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );

      await userCredential.user.updateProfile({
        displayName: userName,
      });
      await userCredential.user.reload();
      authEvents.emit("profile_updated");

      await createUserWithEmail(userCredential.user.uid, userName, email);

      await subscribeToUserTopic(userCredential.user.uid);

      handleSetError("email", null);
      handleSetError("all", null);

      closeAuthModal();
      if (!userCredential.user.emailVerified) openVerifyEmailModal();

      showToast("success", "Inscription réussie !", 100);
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          handleSetError(
            "email",
            "Adresse e-mail déjà utilisée par autres utilisateurs.",
          );
          break;
        case "auth/invalid-email":
          handleSetError("email", "Adresse e-mail est invalide.");
          break;
        case "auth/weak-password":
          handleSetError("email", "Le mot de passe est trop faible.");
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
