import { getUserToken } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";

interface SuggestionSearchParams {
  search: string;
  userToken: string;
}

interface SuggestionSearchResponse {
  suggestions: string[];
}

export const useGetSuggestionSearchAds = () => {
  const getSuggestionSearchAds = async (search: string): Promise<string[]> => {
    if (!search) return [];

    try {
      const userToken = await getUserToken();

      const getSuggestionSearchAdsCallable = firebaseFunctions.httpsCallable<
        SuggestionSearchParams,
        SuggestionSearchResponse
      >("getSuggestionSearchAds");

      const response = await getSuggestionSearchAdsCallable({
        search,
        userToken,
      });

      return response.data.suggestions;
    } catch (error) {
      console.error("Erreur lors de la recherche de suggestions:", error);
      return [];
    }
  };

  return { getSuggestionSearchAds };
};
