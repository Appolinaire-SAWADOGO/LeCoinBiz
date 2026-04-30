import { AnnouncementType } from "@/types";
import { getUserCity } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";

type PageParam = {
  path: string;
  fromUserCity: boolean;
} | null;

type GetHomeAdsResult = {
  ads: AnnouncementType[];
  lastDoc: PageParam;
  hasMore: boolean;
};

export const useGetHomeAds = () => {
  const getHomeAds = async ({ pageParam }: { pageParam?: PageParam }) => {
    try {
      const userCity = await getUserCity();

      if (!userCity) {
        return { ads: [], lastDoc: null, hasMore: false };
      }

      const getHomeAdsCallable = firebaseFunctions.httpsCallable("getHomeAds");

      const response = await getHomeAdsCallable({
        pageParam,
        userCity,
      });

      return response.data as GetHomeAdsResult;
    } catch (error) {
      console.error("Erreur récupération annonces [getHomeAds]:", error);
      return { ads: [], lastDoc: null, hasMore: false };
    }
  };

  return { getHomeAds };
};
