import firestore from "@react-native-firebase/firestore";
import React from "react";

export const useCreateUserWithPhone = (phoneNumber: string) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const createUserWithPhone = async (userId: string) => {
    if (!phoneNumber) return;
    if (!userId) return;

    console.log(
      JSON.stringify(
        {
          phoneNumber,
        },
        null,
        2
      )
    );

    try {
      setIsLoading(true);

      console.log("userId", userId);

      await firestore()
        .collection("Users")
        .doc(userId)
        .set({
          lacation: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          phoneNumber: phoneNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      console.log("User created!");
    } catch (error) {
      console.log("Error creating user with phone number:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createUserWithPhone };
};
