import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

export const adminSetAdPending = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    const { adId, AdTitle, AdUserId } = request.data;

    if (!adId || !AdTitle || !AdUserId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    const title = "⚠️ Votre annonce a été mise en attente";
    const body = `📌 Votre annonce "${AdTitle}" a été temporairement mise en attente car elle ne correspond pas à nos principes d’utilisation. ✏️ Merci de la vérifier et de la modifier si nécessaire.`;

    try {
      const docId = uuidv4();

      await db.collection("Ads").doc(adId).update({ status: "PENDING" });

      const snapshot = await db
        .collection("Reports")
        .where("adId", "==", adId)
        .get();

      const batch = db.batch();

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      await db.collection("Notifications").doc(docId).set({
        title: title,
        body: body,
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
      console.error("Erreur lors de la mise en attente de l'annonce:", error);
      throw new HttpsError(
        "internal",
        "Impossible de mettre l'annonce en attente.",
      );
    }
  },
);
