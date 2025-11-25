// hooks/useGetFilterAds.ts
import { searchClient } from "@/functions/algolia/algoliaSearch";
import { SetFilterType } from "@/store/useFilterStatesStore";
import { AnnouncementType } from "@/types";

const PAGE_SIZE = 10;

interface AlgoliaSearchResponse {
  hits: any[];
  page: number;
  nbPages: number;
  nbHits: number;
  hitsPerPage: number;
}

export const useGetFilterAds = () => {
  const getFilterAds = async ({
    pageParam = 0,
    filtersStatesStore,
  }: {
    pageParam?: number;
    filtersStatesStore: SetFilterType;
  }) => {
    const { search, category, subCategory, city, min, max, tempPub, options } =
      filtersStatesStore;

    try {
      const filters: string[] = [];

      filters.push(`status:"ACTIVATED"`);

      if (category && category !== "Toutes les catégories") {
        filters.push(`category:"${category}"`);
      }

      if (subCategory) {
        filters.push(`subCategory:"${subCategory}"`);
      }

      if (city && city !== "Toutes les villes") {
        filters.push(`city:"${city}"`);
      }

      if (min) {
        filters.push(`price >= ${Number(min)}`);
      }
      if (max) {
        filters.push(`price <= ${Number(max)}`);
      }

      const normalizedTempPub = tempPub?.normalize("NFC").trim();
      if (normalizedTempPub && normalizedTempPub !== "Toutes les annonces") {
        let timestamp: number | null = null;

        if (normalizedTempPub === "Aujourd'hui") {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          timestamp = startOfDay.getTime();
        } else if (normalizedTempPub === "Moins de 3 jours") {
          const date = new Date();
          date.setDate(date.getDate() - 3);
          timestamp = date.getTime();
        } else if (normalizedTempPub === "Moins de 7 jours") {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          timestamp = date.getTime();
        }

        if (timestamp) {
          filters.push(`createdAt >= ${timestamp}`);
        }
      }

      const filtersString = filters.length > 0 ? filters.join(" AND ") : "";

      const response = await searchClient.search({
        requests: [
          {
            indexName: "Ads",
            query: search || "",
            hitsPerPage: PAGE_SIZE,
            page: pageParam,
            filters: filtersString,
            // Optionnel : attributs à retourner
            // attributesToRetrieve: ['title', 'description', 'price', 'images'],
          },
        ],
      });

      const result = response.results[0] as AlgoliaSearchResponse;

      let ads = result.hits.map((hit: any) => ({
        id: hit.objectID,
        ...hit,
      })) as AnnouncementType[];

      const activeOptions = options
        .filter((opt) => opt.active)
        .map((opt) => opt.label);

      if (activeOptions.length > 0) {
        ads = ads.filter((ad) =>
          activeOptions.every((opt) =>
            ad.options?.some((aOpt) => aOpt.label === opt && aOpt.active)
          )
        );
      }

      const hasMore = result.page < result.nbPages - 1;

      return {
        ads,
        lastDoc: result.page,
        hasMore,
        totalHits: result.nbHits,
      };
    } catch (error) {
      console.error("❌ Erreur recherche Algolia :", error);
      return { ads: [], lastDoc: 0, hasMore: false, totalHits: 0 };
    }
  };

  return { getFilterAds };
};
