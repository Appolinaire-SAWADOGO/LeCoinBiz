import { UserType } from "@/types";
import functions from "@react-native-firebase/functions";

export const useGetUserById = () => {
  const getUserById = async (id: string) => {
    try {
      if (!id) return;

      const getUserCallable = functions().httpsCallable<
        { id: string },
        UserType
      >("getUserById");

      const response = await getUserCallable({ id });

      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur et de ses annonces :",
        error,
      );
    }
  };

  return { getUserById };
};
