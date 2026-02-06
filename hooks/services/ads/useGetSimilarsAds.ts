import { AnnouncementType } from "@/types";
import functions from "@react-native-firebase/functions";

interface SimilarAdsParams {
  currentAdId: string;
  title: string;
  category: string;
  subCategory: string;
  conditions: string[];
  description: string;
  userId: string;
  maxResults?: number;
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
    conditions,
    description,
    userId,
    maxResults = 10,
  }: SimilarAdsParams): Promise<AnnouncementsType> => {
    try {
      const getSimilarAdsCallable = functions().httpsCallable<
        SimilarAdsParams,
        SimilarAdsResponse
      >("getSimilarAds");

      const response = await getSimilarAdsCallable({
        currentAdId,
        title,
        category,
        subCategory,
        conditions,
        description,
        userId,
        maxResults,
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
