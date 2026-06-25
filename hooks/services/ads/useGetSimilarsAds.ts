import { AnnouncementType } from "@/types";
import { getUserToken } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";

interface SimilarAdsParams {
  currentAdId: string;
  title?: string;
  category: string;
  subCategory: string;
  city?: string;
  price?: number;
  description: string;
  userId: string;
  maxResults?: number;
  userToken?: string;
}

interface SimilarAdsResponse {
  ads: AnnouncementType[];
}

type AnnouncementsType = AnnouncementType[];

export const useGetSimilarAds = () => {
  const getSimilarAds = async ({
    currentAdId,
    title,
    category,
    subCategory,
    city,
    price,
    description,
    userId,
    maxResults = 10,
  }: SimilarAdsParams): Promise<AnnouncementsType> => {
    try {
      const userToken = await getUserToken();

      const getSimilarAdsCallable = firebaseFunctions.httpsCallable<
        SimilarAdsParams,
        SimilarAdsResponse
      >("getSimilarAds");

      const response = await getSimilarAdsCallable({
        currentAdId,
        title,
        category,
        subCategory,
        city,
        price,
        description,
        userId,
        maxResults,
        userToken,
      });

      return response.data.ads;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des annonces similaires :",
        error,
      );
      return [];
    }
  };

  return { getSimilarAds };
};
