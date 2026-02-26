import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const activateAd = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    const { adId } = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Vous devez être connecté.");
    }

    if (!adId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    try {
      await db.collection("Ads").doc(adId).update({ status: "ACTIVATED" });
      return { success: true };
    } catch (error) {
      console.error("Erreur activation annonce:", error);
      throw new HttpsError("internal", "Impossible d'activer l'annonce.");
    }
  },
);
