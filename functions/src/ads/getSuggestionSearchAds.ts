import { algoliasearch } from "algoliasearch";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const algoliaAppId = defineSecret("ALGOLIA_APP_ID");
const algoliaApiKey = defineSecret("ALGOLIA_API_KEY");

export const getSuggestionSearchAds = onCall(
  {
    secrets: [algoliaAppId, algoliaApiKey],
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    const { search } = request.data;

    if (!search) {
      return { suggestions: [] };
    }

    const client = algoliasearch(algoliaAppId.value(), algoliaApiKey.value());

    try {
      const result = await client.searchSingleIndex({
        indexName: "Ads",
        searchParams: {
          query: search || "",
          hitsPerPage: 5,
          attributesToRetrieve: ["title"],
          attributesToHighlight: ["title"],
          highlightPreTag: "<mark>",
          highlightPostTag: "</mark>",
          filters: "status:ACTIVATED",
        },
      });

      const suggestions = result.hits.map((hit: any) => hit.title);

      return { suggestions };
    } catch (error) {
      console.error("Erreur getSuggestionSearchAds:", error);
      throw new HttpsError(
        "internal",
        "Erreur lors de la recherche de suggestions",
      );
    }
  },
);
