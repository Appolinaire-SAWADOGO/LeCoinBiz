import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";
import { rankSimilarAds } from "../../utils/ranking";

interface SimilarAdsParams {
  currentAdId: string;
  title?: string;
  category: string;
  subCategory: string;
  city?: string;
  price?: number;
  description: string;
  userId: string;
  maxResults?: number;
  userToken?: string;
}

export const getSimilarAds = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    const {
      currentAdId,
      category,
      subCategory,
      userId,
      city,
      price,
      description,
      maxResults = 5,
    } = request.data as SimilarAdsParams;

    if (!currentAdId || !userId) {
      throw new HttpsError(
        "invalid-argument",
        "currentAdId et userId sont requis",
      );
    }

    try {
      let candidates: FirebaseFirestore.DocumentData[] = [];

      // REQUÊTE 1 : même subCategory (pool le plus pertinent)
      const snap1 = await db
        .collection("Ads")
        .where("status", "==", "ACTIVATED")
        .where("category", "==", category)
        .where("subCategory", "==", subCategory)
        .limit(30)
        .get();

      candidates = snap1.docs
        .filter((d) => d.id !== currentAdId && d.data().userId !== userId)
        .map((d) => ({ id: d.id, ...d.data() }));

      // REQUÊTE 2 : si pas assez, élargir à toute la catégorie
      if (candidates.length < maxResults) {
        const snap2 = await db
          .collection("Ads")
          .where("status", "==", "ACTIVATED")
          .where("category", "==", category)
          .limit(50)
          .get();

        const existing = new Set(candidates.map((c) => c.id));

        const extra = snap2.docs
          .filter(
            (d) =>
              d.id !== currentAdId &&
              d.data().userId !== userId &&
              !existing.has(d.id),
          )
          .map((d) => ({ id: d.id, ...d.data() }));

        candidates = [...candidates, ...extra];
      }

      // SCORING : trier les candidats par pertinence
      const scored = candidates.map((ad) => {
        let score = 0;

        if (ad.subCategory === subCategory) score += 3;
        if (city && ad.city === city) score += 2;
        if (price && ad.price) {
          const diff = Math.abs(ad.price - price) / price;
          if (diff < 0.2)
            score += 2; // prix similaire à ±20%
          else if (diff < 0.5) score += 1; // prix similaire à ±50%
        }

        return { ...ad, _score: score };
      });

      // Tri par score décroissant avec bonus boost limité et protection anti-monopole
      const ranked = rankSimilarAds(
        scored.map(({ _score, ...ad }) => ad),
        {
          currentAdId,
          category,
          subCategory,
          city,
          price,
          description,
          userId,
        },
      ).slice(0, maxResults);

      return { ads: ranked };
    } catch (error) {
      console.error("Erreur getSimilarAds:", error);
      throw new HttpsError(
        "internal",
        "Erreur lors de la récupération des annonces similaires",
      );
    }
  },
);
