import { getUserCity } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";

export const useCreateUserWithEmail = () => {
  const createUserWithEmail = async (
    uuid: string,
    userName: string,
    email: string,
  ) => {
    if (!uuid || !email || !userName) return null;

    const userCity = await getUserCity();

    try {
      const createUserCallable = firebaseFunctions.httpsCallable<
        { uid: string; userName: string; email: string; city: string },
        { message: "success" }
      >("createUserWithEmail");

      await createUserCallable({
        uid: uuid,
        userName,
        email,
        city: userCity || "ouagadougou",
      });
    } catch (error: any) {
      console.error("Erreur création user:", error);
    }
  };

  return { createUserWithEmail };
};
