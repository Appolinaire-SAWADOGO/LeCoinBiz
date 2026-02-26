import { UserType } from "@/types";
import { firebasyeFunctions } from "@/utils/firebase";

export const useGetUserById = () => {
  const getUserById = async (id: string) => {
    try {
      if (!id) return;

      const getUserCallable = firebasyeFunctions.httpsCallable<
        { id: string },
        UserType
      >("getUserById");

      const response = await getUserCallable({ id });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return;
    }
  };

  return { getUserById };
};
