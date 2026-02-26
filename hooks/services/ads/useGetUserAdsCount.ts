import { AdStatusType } from "@/types";
import { firebasyeFunctions } from "@/utils/firebase";

type GetUserAdsCountResult = { count: number };

export const useGetUserAdsCount = () => {
  const getUserAdsCount = async (
    userId: string,
    status: AdStatusType = "ACTIVATED",
  ) => {
    try {
      const getUserAdsCountCallable = firebasyeFunctions.httpsCallable<
        { userId: string; status?: AdStatusType },
        GetUserAdsCountResult
      >("getUserAdsCount");

      const response = await getUserAdsCountCallable({ userId, status });
      return response.data.count;
    } catch (error) {
      console.error("Erreur récupération du nombre d'annonces:", error);
      return 0;
    }
  };

  return { getUserAdsCount };
};
