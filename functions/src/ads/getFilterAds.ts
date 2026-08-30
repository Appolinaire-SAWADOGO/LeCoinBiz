import { algoliasearch } from "algoliasearch";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { prioritizeBoostedAds } from "../../utils/ranking";

const algoliaAppId = defineSecret("ALGOLIA_APP_ID");
const algoliaApiKey = defineSecret("ALGOLIA_API_KEY");

const PAGE_SIZE = 10;

// Replicas à créer sur l'index "Ads" côté Algolia :
// - "Ads_createdAt_desc" -> customRanking: ["desc(createdAt)"]
// - "Ads_clicks_desc"    -> customRanking: ["desc(stats.clicks)"]
const INDEX_RECENT = "Ads_createdAt_desc";
const INDEX_POPULAR = "Ads_clicks_desc";

const POPULAR_OPTION_LABEL = "Annonces Populaire";
const BOOST_OPTION_LABEL = "A la une";

export const getFilterAds = onCall(
  {
    secrets: [algoliaAppId, algoliaApiKey],
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    const { page = 0, filtersStatesStore, userToken } = request.data;

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

      // annonce booste
      const isBoostActive = !!options?.some(
        (o: any) => o.label === BOOST_OPTION_LABEL && o.active,
      );

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

      if (isBoostActive) {
        filters.push(`boostStatus:active`);
      }

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

      // "Annonces Populaire" est un critère de TRI, pas une option d'annonce.
      // Il ne doit jamais être utilisé pour filtrer sur ad.options.
      const isPopularActive = !!options?.some(
        (o: any) => o.label === POPULAR_OPTION_LABEL && o.active,
      );

      // Vraies options d'annonce (Livraison Gratuite, Neuf, ...)
      const realActiveOptions = options
        ?.filter(
          (o: any) =>
            o.active &&
            o.label !== POPULAR_OPTION_LABEL &&
            o.label !== BOOST_OPTION_LABEL,
        )
        .map((o: any) => o.label);

      // Choix de l'index :
      // - "Annonces Populaire" actif -> tri par nombre de clics décroissant
      // - sinon -> toujours les annonces les plus récentes en premier
      const indexName = isPopularActive ? INDEX_POPULAR : INDEX_RECENT;

      const filtersString = filters.join(" AND ");

      const result = await client.searchSingleIndex({
        indexName,
        searchParams: {
          query: search || "",
          hitsPerPage: PAGE_SIZE,
          page,
          filters: filtersString,
          userToken: userToken ?? "anonymous",
        },
      });

      let ads = result.hits.map((hit: any) => ({
        id: hit.objectID,
        ...hit,
      }));

      if (realActiveOptions?.length) {
        ads = ads.filter((ad: any) =>
          realActiveOptions.every((opt: string) =>
            ad.options?.some((aOpt: any) => aOpt.label === opt && aOpt.active),
          ),
        );
      }

      const finalAds = isBoostActive ? ads : prioritizeBoostedAds(ads, 2, 1);

      return {
        ads: finalAds,
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
