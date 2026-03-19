import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

if (!admin.apps.length) {
  }

const db = admin.firestore();
const PAGE_SIZE = 10;

export const getHomeAds = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const pageParam = request.data?.pageParam || null;
      const userCity = request.data?.userCity || null;

      if (!userCity) {
        throw new HttpsError("invalid-argument", "Ville utilisateur manquante");
      }

      let allAds: any[] = [];
      let lastDocRef: any = null;
      let stillInUserCity = false;

      // ========== CHERCHER DANS VILLE USER ==========
      // Skip si on est déjà passé aux autres villes
      if (!pageParam || pageParam.fromUserCity !== false) {
        let userCityQuery = db
          .collection("Ads")
          .where("status", "==", "ACTIVATED")
          .where("city", "==", userCity)
          .orderBy("createdAt", "desc")
          .limit(PAGE_SIZE);

        if (pageParam?.path && pageParam?.fromUserCity === true) {
          const lastDoc = await db.doc(pageParam.path).get();
          if (lastDoc.exists) {
            userCityQuery = userCityQuery.startAfter(lastDoc);
          }
        }

        const userCitySnapshot = await userCityQuery.get();

        allAds = userCitySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          fromUserCity: true,
        }));

        // ✅ LOGIQUE CORRECTE : On regarde combien on a récupéré
        if (allAds.length === PAGE_SIZE) {
          // On a rempli 10 annonces avec la ville user
          // → Il en reste peut-être d'autres
          lastDocRef = userCitySnapshot.docs[userCitySnapshot.docs.length - 1];
          stillInUserCity = true; // ← On reste dans la ville user
        } else {
          // On a récupéré moins de 10 annonces
          // → La ville user est épuisée
          stillInUserCity = false; // ← On va passer aux autres villes
        }
      }

      // ========== COMPLÉTER AVEC AUTRES VILLES ==========
      if (!stillInUserCity && allAds.length < PAGE_SIZE) {
        const remainingCount = PAGE_SIZE - allAds.length;

        let otherCitiesQuery = db
          .collection("Ads")
          .where("status", "==", "ACTIVATED")
          .where("city", "!=", userCity)
          .orderBy("createdAt", "desc")
          .limit(remainingCount);

        if (pageParam?.path && pageParam?.fromUserCity === false) {
          const lastDoc = await db.doc(pageParam.path).get();
          if (lastDoc.exists) {
            otherCitiesQuery = otherCitiesQuery.startAfter(lastDoc);
          }
        }

        const otherCitiesSnapshot = await otherCitiesQuery.get();

        const otherCityAds = otherCitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          fromUserCity: false,
        }));

        allAds = [...allAds, ...otherCityAds];

        if (otherCityAds.length > 0) {
          lastDocRef =
            otherCitiesSnapshot.docs[otherCitiesSnapshot.docs.length - 1];
        }
      }

      const hasMore = allAds.length === PAGE_SIZE;

      return {
        ads: allAds,
        lastDoc: lastDocRef
          ? {
              path: lastDocRef.ref.path,
              fromUserCity: stillInUserCity,
            }
          : null,
        hasMore,
      };
    } catch (error: any) {
      console.error("Erreur récupération annonces :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);

