import { algoliasearch } from "algoliasearch";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const algoliaAppId = defineSecret("ALGOLIA_APP_ID");
const algoliaApiKey = defineSecret("ALGOLIA_API_KEY");

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

export const getSimilarAds = onCall(
  {
    secrets: [algoliaAppId, algoliaApiKey],
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    const {
      currentAdId,
      title,
      category,
      subCategory,
      conditions,
      description,
      userId,
      maxResults = 10,
    } = request.data as SimilarAdsParams;

    if (!currentAdId || !userId) {
      throw new HttpsError(
        "invalid-argument",
        "currentAdId et userId sont requis",
      );
    }

    const client = algoliasearch(algoliaAppId.value(), algoliaApiKey.value());

    try {
      let similarAds: any[] = [];

      // Fonction utilitaire pour exécuter une recherche
      const runSearch = async (
        query: string,
        filters: string,
        hitsToFetch: number,
      ) => {
        const result = await client.searchSingleIndex({
          indexName: "Ads",
          searchParams: {
            query: query || "",
            hitsPerPage: hitsToFetch,
            filters,
          },
        });

        return result.hits.map((hit: any) => ({
          id: hit.objectID,
          ...hit,
        }));
      };

      // ==========================================
      // STRATÉGIE 1 : Catégorie + Sous-catégorie + Conditions
      // ==========================================
      let filters = [
        `NOT objectID:${currentAdId}`,
        `NOT userId:${userId}`,
        `category:"${category}"`,
        `subCategory:"${subCategory}"`,
        `status:ACTIVATED`,
      ];

      if (conditions && conditions.length > 0) {
        const conditionsFilter = conditions
          .map((c) => `conditions:"${c}"`)
          .join(" OR ");
        filters.push(`(${conditionsFilter})`);
      }

      similarAds = await runSearch(
        `${title || ""} ${description || ""}`.trim(),
        filters.join(" AND "),
        maxResults,
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
          `status:ACTIVATED`,
        ].join(" AND ");

        const newAds = await runSearch(
          `${title || ""} ${description || ""}`.trim(),
          filters2,
          remaining,
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
          `status:ACTIVATED`,
        ].join(" AND ");

        const newAds = await runSearch(
          `${title || ""} ${description || ""}`.trim(),
          filters3,
          remaining,
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
          `status:ACTIVATED`,
        ].join(" AND ");

        const newAds = await runSearch("", filters4, remaining);
        similarAds = [
          ...similarAds,
          ...newAds.filter((a) => !similarAds.find((s) => s.id === a.id)),
        ];
      }

      return {
        ads: similarAds.slice(0, maxResults),
      };
    } catch (error) {
      console.error("Erreur getSimilarAds:", error);
      throw new HttpsError(
        "internal",
        "Erreur lors de la récupération des annonces similaires",
      );
    }
  },
);
