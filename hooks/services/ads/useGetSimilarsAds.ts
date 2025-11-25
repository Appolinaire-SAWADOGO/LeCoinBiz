import { searchClient } from "@/functions/algolia/algoliaSearch";
import { AnnouncementType } from "@/types";

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

interface AlgoliaSearchResponse {
  hits: any[];
  page: number;
  nbPages: number;
  nbHits: number;
  hitsPerPage: number;
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
      let similarAds: AnnouncementsType = [];

      // Fonction utilitaire pour exécuter une recherche avec searchClient
      const runSearch = async (
        query: string,
        filters: string,
        hitsToFetch: number
      ) => {
        const response = await searchClient.search({
          requests: [
            {
              indexName: "Ads",
              query: query || "",
              hitsPerPage: hitsToFetch,
              filters,
            },
          ],
        });

        const result = response.results[0] as AlgoliaSearchResponse;
        return (result.hits as any[]).map((hit) => ({
          id: hit.objectID,
          ...hit,
        })) as AnnouncementsType;
      };

      // ==========================================
      // STRATÉGIE 1 : Catégorie + Sous-catégorie + Conditions
      // ==========================================
      let filters = [
        `NOT objectID:${currentAdId}`,
        `NOT userId:${userId}`,
        `category:"${category}"`,
        `subCategory:"${subCategory}"`,
        `status:"ACTIVATED"`,
      ];

      if (conditions.length > 0) {
        const conditionsFilter = conditions
          .map((c) => `conditions:"${c}"`)
          .join(" OR ");
        filters.push(`(${conditionsFilter})`);
      }

      similarAds = await runSearch(
        `${title} ${description}`.trim(),
        filters.join(" AND "),
        maxResults
      );

      // ==========================================
      // STRATÉGIE 2 : Catégorie + Sous-catégorie
      // ==========================================
      if (similarAds.length < maxResults) {
        const remaining = maxResults - similarAds.length;
        const filters2 = [
          `NOT objectID:${currentAdId}`,
          `NOT userId:${userId}`,
          `category:"${category}"`,
          `subCategory:"${subCategory}"`,
          `status:"ACTIVATED"`,
        ].join(" AND ");

        const newAds = await runSearch(
          `${title} ${description}`.trim(),
          filters2,
          remaining
        );
        similarAds = [
          ...similarAds,
          ...newAds.filter((a) => !similarAds.find((s) => s.id === a.id)),
        ];
      }

      // ==========================================
      // STRATÉGIE 3 : Catégorie seulement
      // ==========================================
      if (similarAds.length < maxResults) {
        const remaining = maxResults - similarAds.length;
        const filters3 = [
          `NOT objectID:${currentAdId}`,
          `NOT userId:${userId}`,
          `category:"${category}"`,
          `status:"ACTIVATED"`,
        ].join(" AND ");

        const newAds = await runSearch(
          `${title} ${description}`.trim(),
          filters3,
          remaining
        );
        similarAds = [
          ...similarAds,
          ...newAds.filter((a) => !similarAds.find((s) => s.id === a.id)),
        ];
      }

      // ==========================================
      // STRATÉGIE 4 : Annonces aléatoires
      // ==========================================
      if (similarAds.length < maxResults) {
        const remaining = maxResults - similarAds.length;
        const filters4 = [
          `NOT objectID:${currentAdId}`,
          `NOT userId:${userId}`,
          `status:"ACTIVATED"`,
        ].join(" AND ");

        const newAds = await runSearch("", filters4, remaining);
        similarAds = [
          ...similarAds,
          ...newAds.filter((a) => !similarAds.find((s) => s.id === a.id)),
        ];
      }

      return similarAds.slice(0, maxResults);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des annonces similaires :",
        error
      );
      return [];
    }
  };

  return { getSimilarAds };
};
