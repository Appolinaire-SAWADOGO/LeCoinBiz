import { AdStatusType } from "@/types";
import firestore from "@react-native-firebase/firestore";

export const useGetUserAdsCount = () => {
  const getUserAdsCount = async (
    userId: string,
    status: AdStatusType = "ACTIVATED"
  ) => {
    try {
      if (!userId) {
        console.warn("Aucun ID utilisateur fourni");
        return;
      }

      const rslt = await firestore()
        .collection("Ads")
        .where("userId", "==", userId)
        .where("status", "==", status)
        .count()
        .get();

      return rslt.data().count;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre d'annonces :",
        error
      );
    }
  };

  return { getUserAdsCount };
};
