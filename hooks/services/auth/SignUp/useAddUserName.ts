import { useAddUsernameModalStore } from "@/store/useAddUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { showToast } from "@/utils";
import {} from "@/utils/auth";
import { validateUsername } from "@/utils/auth/validation";
import { authEvents } from "@/utils/EventEmitter";
import firestore from "@react-native-firebase/firestore";
import React from "react";
import { useCurrentUser } from "../signIn/useCurrentUser";

export const useAddUserName = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { onClose: onCloseAddYourUsernameModal } = useAddUsernameModalStore();
  const { onClose: onCloseAuthModal } = useAuthModalStore();

  const currentUser = useCurrentUser();

  const addUserName = async (userName: string) => {
    if (!userName || !validateUsername(userName).isValid) return;

    const userUuid = currentUser?.uid;
    const userPhoneNumber = currentUser?.phoneNumber;

    if (!userUuid || !userPhoneNumber) return;

    try {
      setIsLoading(true);

      await currentUser.updateProfile({ displayName: userName });
      await currentUser.reload();
      authEvents.emit("profile_updated");

      await firestore().collection("Users").doc(userUuid).update({
        userName: userName,
      });

      setError(null);

      setIsLoading(false);

      onCloseAuthModal();
      onCloseAddYourUsernameModal();

      showToast("success", "Nom d'utilisateur ajoute.", 100);
    } catch (error: any) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur lors de l'ajout du nom d'utilisateur:", error);
      setIsLoading(false);
    }
  };

  return { addUserName, isLoading, error };
};
