import { algoliasearch } from "algoliasearch";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const algoliaAppId = defineSecret("ALGOLIA_APP_ID");
const algoliaApiKey = defineSecret("ALGOLIA_API_KEY");

const PAGE_SIZE = 10;

export const getFilterAds = onCall(
  {
    secrets: [algoliaAppId, algoliaApiKey],
    consumeAppCheckToken: false,
    invoker: "public",
    region: "europe-southwest1",
  },
  async (request) => {
    const { page = 0, filtersStatesStore } = request.data;

    const client = algoliasearch(algoliaAppId.value(), algoliaApiKey.value());

    try {
      const {
        search,
        category,
        subCategory,
        city,
        min,
        max,
        tempPub,
        options,
      } = filtersStatesStore || {};

      const filters: string[] = [];
      filters.push(`status:ACTIVATED`);

      if (category && category !== "Toutes les catégories") {
        filters.push(`category:"${category}"`);
      }
      if (subCategory) {
        filters.push(`subCategory:"${subCategory}"`);
      }
      if (city && city !== "Toutes les villes") {
        filters.push(`city:"${city}"`);
      }
      if (min) filters.push(`price >= ${Number(min)}`);
      if (max) filters.push(`price <= ${Number(max)}`);

      if (tempPub && tempPub !== "ALL") {
        let timestamp: number | null = null;

        if (tempPub === "TODAY") {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          timestamp = d.getTime();
        } else if (tempPub === "THREE_DAYS") {
          const d = new Date();
          d.setDate(d.getDate() - 3);
          timestamp = d.getTime();
        } else if (tempPub === "SEVEN_DAYS") {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          timestamp = d.getTime();
        }

        if (timestamp) filters.push(`createdAt >= ${timestamp}`);
      }

      const filtersString = filters.join(" AND ");

      const result = await client.searchSingleIndex({
        indexName: "Ads",
        searchParams: {
          query: search || "",
          hitsPerPage: PAGE_SIZE,
          page,
          filters: filtersString,
        },
      });

      let ads = result.hits.map((hit: any) => ({
        id: hit.objectID,
        ...hit,
      }));

      const activeOptions = options
        ?.filter((o: any) => o.active)
        .map((o: any) => o.label);

      if (activeOptions?.length) {
        ads = ads.filter((ad: any) =>
          activeOptions.every((opt: string) =>
            ad.options?.some((aOpt: any) => aOpt.label === opt && aOpt.active),
          ),
        );
      }

      return {
        ads,
        currentPage: result.page,
        hasMore: result.page! < result.nbPages! - 1,
        lastDoc: result.page,
        totalHits: result.nbHits,
        totalPages: result.nbPages,
      };
    } catch (error) {
      console.error("getFilterAds error:", error);
      throw new HttpsError("internal", "Erreur de recherche.");
    }
  },
);
