import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

export const disableAd = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { adId } = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Utilisateur non authentifié.");
    }

    if (!adId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    try {
      await db.collection("Ads").doc(adId).update({
        status: "DISABLED",
      });

      return { success: true };
    } catch (error) {
      console.error("disableAd error:", error);
      throw new HttpsError("internal", "Impossible de désactiver l'annonce.");
    }
  },
);
