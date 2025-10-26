// hooks/useGetFilterAds.ts
import { searchClient } from "@/functions/algolia/algoliaSearch";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { AnnouncementsType } from "@/types";

const PAGE_SIZE = 10;

// Type pour la réponse Algolia
interface AlgoliaSearchResponse {
  hits: any[];
  page: number;
  nbPages: number;
  nbHits: number;
  hitsPerPage: number;
}

export const useGetFilterAds = () => {
  const { search, category, subCategory, city, min, max, tempPub, options } =
    useFilterStatesStore();

  const getFilterAds = async ({ pageParam = 0 }: { pageParam?: number }) => {
    try {
      // Construire les filtres Algolia
      const filters: string[] = [];

      // Filtre de catégorie
      if (category && category !== "Toutes les catégories") {
        filters.push(`category:"${category}"`);
      }

      // Filtre de sous-catégorie
      if (subCategory) {
        filters.push(`subCategory:"${subCategory}"`);
      }

      // Filtre de ville
      if (city && city !== "Toutes les villes") {
        filters.push(`city:"${city}"`);
      }

      // Filtre de prix
      if (min) {
        filters.push(`price >= ${Number(min)}`);
      }
      if (max) {
        filters.push(`price <= ${Number(max)}`);
      }

      // Filtre de date de publication
      console.log("tempPub = ", tempPub);

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

      // Combiner tous les filtres avec AND
      const filtersString = filters.length > 0 ? filters.join(" AND ") : "";

      // Recherche Algolia
      const response = await searchClient.search({
        requests: [
          {
            indexName: "Ads",
            query: search || "", // Recherche textuelle sur title, description, etc.
            hitsPerPage: PAGE_SIZE,
            page: pageParam, // Pagination Algolia (commence à 0)
            filters: filtersString,
            // Optionnel : attributs à retourner
            // attributesToRetrieve: ['title', 'description', 'price', 'images'],
          },
        ],
      });

      // Cast avec vérification
      const result = response.results[0] as AlgoliaSearchResponse;

      let ads = result.hits.map((hit: any) => ({
        id: hit.objectID,
        ...hit,
      })) as AnnouncementsType[];

      // Filtrer les options côté client (si nécessaire)
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

      // console.log("ads :", JSON.stringify(ads, null, 2));
      console.log("filters :", filtersString);

      return {
        ads,
        lastDoc: result.page, // Numéro de page pour la pagination
        hasMore,
        totalHits: result.nbHits, // Nombre total de résultats
      };
    } catch (error) {
      console.error("❌ Erreur recherche Algolia :", error);
      return { ads: [], lastDoc: 0, hasMore: false, totalHits: 0 };
    }
  };

  return { getFilterAds };
};
