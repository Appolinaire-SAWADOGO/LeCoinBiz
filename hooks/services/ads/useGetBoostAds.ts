import { AnnouncementType } from "@/types";
import { firebaseFunctions } from "@/utils/firebase";

export const useGetBoostAds = () => {
  const getBoostAds = async () => {
    try {
      const getBoostAdsCallable = firebaseFunctions.httpsCallable<
        void,
        AnnouncementType[]
      >("getBoostAds");

      const response = await getBoostAdsCallable();

      return response.data;
    } catch (error) {
      console.error("Erreur récupération annonces boostées:", error);
      throw error;
    }
  };

  return { getBoostAds };
};
