import { firebasyeFunctions } from "@/utils/firebase";
import React from "react";

export const useCreateUserWithPhone = (phoneNumber: string) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const createUserWithPhone = async (userId: string) => {
    if (!phoneNumber) return;
    if (!userId) return;

    try {
      setIsLoading(true);

      const createUserCallable = firebasyeFunctions.httpsCallable<
        { uid: string; phoneNumber: string },
        { success: boolean }
      >("createUserWithPhone");

      await createUserCallable({
        uid: userId,
        phoneNumber,
      });
    } catch (error) {
      console.log("Error creating user with phone number:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createUserWithPhone };
};
