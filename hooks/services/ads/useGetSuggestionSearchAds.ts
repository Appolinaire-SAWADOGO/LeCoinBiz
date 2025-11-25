import { searchClient } from "@/functions/algolia/algoliaSearch";

export const useGetSuggestionSearchAds = () => {
  const getSuggestionSearchAds = async (search: string) => {
    if (!search) return [];

    try {
      const response = await searchClient.search({
        requests: [
          {
            indexName: "Ads",
            query: search || "",
            hitsPerPage: 5,
            attributesToRetrieve: ["title"],
            attributesToHighlight: ["title"],
            highlightPreTag: "<mark>",
            highlightPostTag: "</mark>",
            filters: 'status:"ACTIVATED"',
            // Optionnel : chercher uniquement au début du mot
            // restrictSearchableAttributes: ["title"],
          },
        ],
      });

      const result = response.results[0];

      console.log("results");

      if ("hits" in result) {
        return result.hits.map((hit: any) => hit.title);
      }

      return [];
    } catch (error) {
      console.error("Erreur lors de la recherche de suggestions:", error);
      return [];
    }
  };

  return { getSuggestionSearchAds };
};
