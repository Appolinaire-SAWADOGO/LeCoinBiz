import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

const PAGE_SIZE = 10;

interface PageParam {
  path: string;
}

export const getFavoriteAdsByUserId = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const userId = request.auth?.uid;

      const pageParamRaw = request.data?.pageParam;

      const pageParam: PageParam | null =
        pageParamRaw &&
        typeof pageParamRaw.path === "string" &&
        pageParamRaw.path.trim() !== ""
          ? pageParamRaw
          : null;

      if (!userId) {
        throw new HttpsError("unauthenticated", "Utilisateur non authentifié");
      }

      let favoritesQuery = db
        .collection("Favorites")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (pageParam) {
        if (!pageParam.path || pageParam.path.trim() === "") {
          throw new HttpsError(
            "invalid-argument",
            "pageParam.path est invalide",
          );
        }

        const lastFavDoc = await db.doc(pageParam.path).get();
        if (!lastFavDoc.exists) {
          throw new HttpsError(
            "not-found",
            "Document de pagination introuvable",
          );
        }
        favoritesQuery = favoritesQuery.startAfter(lastFavDoc);
      }

      const favoritesSnap = await favoritesQuery.get();

      if (favoritesSnap.empty) {
        return { ads: [], lastDoc: null, hasMore: false };
      }

      const adsIds = favoritesSnap.docs.map((doc) => doc.data().adId as string);

      const adsDocs = await Promise.all(
        adsIds.map((adId) => db.collection("Ads").doc(adId).get()),
      );

      const favoritesAds = adsDocs
        .filter((doc) => doc.exists)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      const lastDocSnap =
        favoritesSnap.docs[favoritesSnap.docs.length - 1] || null;

      return {
        ads: favoritesAds,
        lastDoc: lastDocSnap ? { path: lastDocSnap.ref.path } : null,
        hasMore: favoritesSnap.docs.length === PAGE_SIZE,
      };
    } catch (error: any) {
      console.error("Erreur getFavoriteAdsByUserId:", error);
      throw new HttpsError("internal", error.message);
    }
  },
);

