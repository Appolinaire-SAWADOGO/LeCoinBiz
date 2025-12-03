import { UserType } from "@/types";
import firestore from "@react-native-firebase/firestore";

export const useGetUserById = () => {
  const getUserById = async (id: string) => {
    try {
      if (!id) return;

      const userSnap = await firestore().collection("Users").doc(id).get();

      if (!userSnap.exists) {
        console.warn("Utilisateur introuvable :", id);
        return;
      }

      const userData = userSnap.data() as Omit<UserType, "id">;

      return { id, ...userData };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur et de ses annonces :",
        error
      );
    }
  };

  return { getUserById };
};
