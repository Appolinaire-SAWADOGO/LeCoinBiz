import { AnnouncementType } from "@/types";
import firestore from "@react-native-firebase/firestore";

export const useGetAdById = () => {
  const getAdById = async (id: string) => {
    try {
      const adDoc = await firestore().collection("Ads").doc(id).get();

      if (!adDoc.exists) {
        console.warn("Annonce non trouvée !");
        return null;
      }

      const adData = adDoc.data() as Omit<AnnouncementType, "id">;

      return { id, ...adData };
    } catch (error) {
      console.error("Erreur récupération annonce/utilisateur :", error);
      return null;
    }
  };

  return { getAdById };
};
