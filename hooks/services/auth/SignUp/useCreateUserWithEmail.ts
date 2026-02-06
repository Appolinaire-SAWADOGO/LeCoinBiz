import functions from "@react-native-firebase/functions";

export const useCreateUserWithEmail = () => {
  const createUserWithEmail = async (
    uuid: string,
    userName: string,
    email: string,
  ) => {
    if (!uuid || !email || !userName) return;

    try {
      const createUserCallable = functions().httpsCallable<
        { uid: string; userName: string; email: string },
        { message: "success" }
      >("createUserWithEmail");

      await createUserCallable({ uid: uuid, userName, email });
    } catch (error: any) {
      console.error("Erreur création user:", error);
    }
  };

  return { createUserWithEmail };
};
