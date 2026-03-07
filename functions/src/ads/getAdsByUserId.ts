import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();
const PAGE_SIZE = 10;

export const getAdsByUserId = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { userId, status = "ACTIVATED", lastCreatedAt } = request.data;

    if (!userId) {
      throw new HttpsError("invalid-argument", "Utilisateur introuvable.");
    }

    try {
      let query = db
        .collection("Ads")
        .where("userId", "==", userId)
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (lastCreatedAt) {
        query = query.startAfter(lastCreatedAt);
      }

      const snap = await query.get();

      const ads = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastDoc = snap.docs[snap.docs.length - 1];

      return {
        ads,
        lastCreatedAt: lastDoc?.data()?.createdAt ?? null,
        hasMore: snap.docs.length === PAGE_SIZE,
      };
    } catch (error) {
      console.error("getAdsByUserId error:", error);
      throw new HttpsError("internal", "Impossible de récupérer les annonces.");
    }
  },
);
