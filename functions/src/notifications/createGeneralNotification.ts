import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

export const createGeneralNotification = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    try {
      const { title, body } = request.data;

      if (!title || !body) {
        throw new HttpsError("invalid-argument", "title et body sont requis");
      }

      const docId = uuidv4();

      await db.collection("Notifications").doc(docId).set({
        title,
        body,
        type: "GENERAL_NOTIFICATION",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await admin.messaging().send({
        topic: "general",
        notification: {
          title,
          body,
        },
      });

      return {
        succes: true,
      };
    } catch (error: any) {
      console.error("Erreur createGeneralNotification :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
