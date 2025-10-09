import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React from "react";

export const useAddUserName = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { setUserNameIsAdded } = useAuthStore();
  const {onClose } = useAddYourUsernameModalStore();

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
      onClose();

      console.log("User name is added!");
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return { addUserName, isLoading, error };
};
