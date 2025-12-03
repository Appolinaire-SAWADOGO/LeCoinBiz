import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React from "react";

export const useAddUserName = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { setUserNameIsAdded } = useAuthStore();
  const { onClose } = useAddYourUsernameModalStore();

  const addUserName = async (userName: string) => {
    if (!userName) return;

    const auth = getAuth();
    const userUuid = auth.currentUser?.uid;
    const userPhoneNumber = auth.currentUser?.phoneNumber;

    if (!userUuid || !userPhoneNumber) return;

    try {
      setIsLoading(true);

      await firestore().collection("Users").doc(userUuid).update({
        userName: userName,
      });

      setUserNameIsAdded(true);
      setIsLoading(false);
      setError(null);

      onClose();
    } catch (error: any) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur lors de l'ajout du nom d'utilisateur:", error);
      setIsLoading(false);
    }
  };

  return { addUserName, isLoading, error };
};
