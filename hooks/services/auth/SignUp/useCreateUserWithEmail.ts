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
          lacation: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          email: email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      console.log("User added!");
    } catch (error) {
      console.log("Error creating user with phone number:", error);
    }
  };

  return { createUserWithEmail };
};
