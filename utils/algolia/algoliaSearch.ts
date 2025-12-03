// services/algoliaSearch.ts
import { algoliasearch } from "algoliasearch";

const ALGOLIA_APP_ID = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID as string; // ← Remplacez par votre Application ID
const ALGOLIA_WRITE_KEY = process.env.EXPO_PUBLIC_ALGOLIA_WRITE_KEY as string; // ← Remplacez par votre Write API Key
// ⚠️ ATTENTION : Ne jamais exposer la Write API Key côté client en production !

// Client de recherche (sécurisé, peut être exposé côté client)
export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

/**
 * Fonction de recherche générique
 */
export const searchAds = async (
  query: string,
  filters?: string,
  page: number = 0,
  hitsPerPage: number = 10
) => {
  try {
    const response = await searchClient.search({
      requests: [
        {
          indexName: "Ads",
          query,
          hitsPerPage,
          page,
          filters: filters || "",
        },
      ],
    });

    return response.results[0];
  } catch (error) {
    console.error("Erreur de recherche Algolia:", error);
    throw error;
  }
};
