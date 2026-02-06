import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

export const adminActivateAd = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    const { adId, adTitle, AdUserId } = request.data;

    if (!adId || !adTitle || !AdUserId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    const docId = uuidv4();

    const title = "✅ Annonce activée";
    const body = `📢 Votre annonce "${adTitle}" est maintenant activée et visible par tous les utilisateurs.`;

    try {
      await db.collection("Ads").doc(adId).update({ status: "ACTIVATED" });

      await db.collection("Notifications").doc(docId).set({
        title,
        body,
        type: "USER_NOTIFICATION",
        userId: AdUserId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await admin.messaging().send({
        topic: `user_${AdUserId}`,
        notification: {
          title,
          body,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur activation annonce:", error);
      throw new HttpsError("internal", "Impossible d'activer l'annonce.");
    }
  },
);
