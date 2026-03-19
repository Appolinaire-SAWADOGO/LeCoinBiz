import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

if (!admin.apps.length) {
  }

const db = admin.firestore();

export const getAdById = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { adId } = request.data;

    if (!adId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    try {
      const doc = await db.collection("Ads").doc(adId).get();

      if (!doc.exists) {
        return { ad: null };
      }

      return {
        ad: {
          id: doc.id,
          ...doc.data(),
        },
      };
    } catch (error) {
      console.error("getAdById error:", error);
      throw new HttpsError("internal", "Impossible de récupérer l'annonce.");
    }
  },
);

