import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

interface ReportAdParams {
  userId: string;
  adId: string;
  adUserId: string;
}

export const reportAd = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { userId, adId, adUserId } = request.data as ReportAdParams;

      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Vous devez être connecté.");
      }

      if (!userId || !adId || !adUserId) {
        throw new HttpsError(
          "invalid-argument",
          "userId, adId et adUserId sont requis",
        );
      }

      if (userId === adUserId) {
        throw new HttpsError(
          "failed-precondition",
          "Vous ne pouvez pas signaler votre propre annonce",
        );
      }

      const existingQuery = await db
        .collection("Reports")
        .where("userId", "==", userId)
        .where("adId", "==", adId)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        return { message: "already_exists" };
      } else {
        const docId = uuidv4();
        await db.collection("Reports").doc(docId).set({
          userId,
          adId,
          count: 1,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { message: "created" };
      }
    } catch (error: any) {
      console.error("Erreur lors du signalement de l'annonce :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
