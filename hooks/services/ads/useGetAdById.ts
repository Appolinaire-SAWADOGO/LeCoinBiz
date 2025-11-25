import { AnnouncementType, UserType } from "@/types";
import firestore from "@react-native-firebase/firestore";

export const useGetAdById = () => {
  const getAdById = async (
    id: string
  ): Promise<{
    ad: AnnouncementType | null;
    user: (UserType & { adsCount: number }) | null;
  }> => {
    try {
      const adDoc = await firestore().collection("Ads").doc(id).get();

      if (!adDoc.exists) {
        console.warn("Annonce non trouvée !");
        return { ad: null, user: null };
      }

      const adData = adDoc.data() as AnnouncementType;

      let userData: (UserType & { adsCount: number }) | null = null;

      if (adData.userId) {
        const userDoc = await firestore()
          .collection("Users")
          .doc(adData.userId)
          .get();

        if (!!userDoc.exists) {
          const userBase = userDoc.data() as UserType;

          const adsSnapshot = await firestore()
            .collection("Ads")
            .where("userId", "==", adData.userId)
            .where("status", "==", "ACTIVATED")
            .get();

          const adsCount = adsSnapshot.size;

          const { id: _, ...rest } = userBase;

          userData = {
            id: userDoc.id,
            ...rest,
            adsCount,
          };
        }
      }

      return { ad: adData, user: userData };
    } catch (error) {
      console.error("Erreur récupération annonce/utilisateur :", error);
      return { ad: null, user: null };
    }
  };

  return { getAdById };
};
