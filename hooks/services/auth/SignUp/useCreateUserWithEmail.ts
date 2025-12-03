import firestore from "@react-native-firebase/firestore";

export const useCreateUserWithEmail = () => {
  const createUserWithEmail = async (
    uuid: string,
    userName: string,
    email: string
  ) => {
    if (!uuid || !email || !userName) return;

    console.log(
      JSON.stringify(
        {
          uuid,
          email,
          userName,
        },
        null,
        2
      )
    );

    try {
      await firestore()
        .collection("Users")
        .doc(uuid)
        .set({
          userName: userName,
          image: "",
          location: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          email: email,
          authMethod: "EMAIL_PASSWORD",
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.log("Error creating user with phone number:", error);
    }
  };

  return { createUserWithEmail };
};
