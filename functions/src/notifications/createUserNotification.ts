import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

export const createUserNotification = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    try {
      const { title, body, userId } = request.data;

      if (!title || !body || !userId) {
        throw new HttpsError(
          "invalid-argument",
          "title, body et userId sont requis",
        );
      }

      const docId = uuidv4();

      await db.collection("Notifications").doc(docId).set({
        title,
        body,
        type: "USER_NOTIFICATION",
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await admin.messaging().send({
        topic: `user_${userId}`,
        notification: {
          title,
          body,
        },
      });

      return {
        succes: true,
      };
    } catch (error: any) {
      console.error("Erreur createUserNotification :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
