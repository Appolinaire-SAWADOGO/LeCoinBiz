import { firebasyeFunctions } from "@/utils/firebase";

interface SuggestionSearchParams {
  search: string;
}

interface SuggestionSearchResponse {
  suggestions: string[];
}

export const useGetSuggestionSearchAds = () => {
  const getSuggestionSearchAds = async (search: string): Promise<string[]> => {
    if (!search) return [];

    try {
      const getSuggestionSearchAdsCallable = firebasyeFunctions.httpsCallable<
        SuggestionSearchParams,
        SuggestionSearchResponse
      >("getSuggestionSearchAds");

      const response = await getSuggestionSearchAdsCallable({ search });

      return response.data.suggestions;
    } catch (error) {
      console.error("Erreur lors de la recherche de suggestions:", error);
      return [];
    }
  };

  return { getSuggestionSearchAds };
};
