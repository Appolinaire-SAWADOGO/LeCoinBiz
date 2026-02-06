import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const adminIgnoreAdReport = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    const { adId } = request.data;

    if (!adId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    try {
      const reportsSnapshot = await db
        .collection("Reports")
        .where("adId", "==", adId)
        .get();

      const batch = db.batch();

      reportsSnapshot.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();

      return { success: true };
    } catch (error) {
      console.error(
        "Error l'ors de l'ignoration du signalement d'annonce",
        error,
      );
      throw new HttpsError(
        "internal",
        "Impossible dignore le dignalement de l'annonce.",
      );
    }
  },
);
