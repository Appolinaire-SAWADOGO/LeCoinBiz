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
          image: "",
          lacation: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          authMethod: "PHONE_NUMBER",
          phoneNumber: phoneNumber,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
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
