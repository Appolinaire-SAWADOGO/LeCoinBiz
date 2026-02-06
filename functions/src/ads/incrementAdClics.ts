import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const incrementAdClics = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    const { adId, adUserId, from } = request.data;

    const userId = request.auth?.uid;

    if (!adId || !!adUserId || !from) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    if (from === "ProfilePage" || (userId && userId === adUserId)) {
      throw new HttpsError(
        "permission-denied",
        "Vous ne pouvez pas effectuer cette action",
      );
    }

    try {
      await db
        .collection("Ads")
        .doc(adId)
        .update({
          "stats.clicks": FieldValue.increment(1),
        });

      return { success: true };
    } catch (error: any) {
      console.error(
        "Erreur l'ors de l'incrementation du clics de l'annones",
        error,
      );
      throw new HttpsError("internal", error.message);
    }
  },
);
