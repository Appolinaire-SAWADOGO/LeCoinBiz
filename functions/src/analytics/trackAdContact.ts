import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

export const trackAdContact = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { adId, contactType } = request.data as {
        adId: string;
        contactType: "whatsapp" | "sms" | "call";
      };

      const userId = request.auth?.uid ?? null;

      if (!adId || !contactType) {
        throw new HttpsError("invalid-argument", "adId et contactType requis.");
      }

      const today = new Date().toISOString().split("T")[0];
      const dayRef = db.collection("AdContacts").doc(today);
      const eventsCol = dayRef.collection("AdContactsEvents");

      await db.runTransaction(async (transaction) => {
        const daySnap = await transaction.get(dayRef);
        const newEventRef = eventsCol.doc();

        // Créer ou incrémenter le document agrégé du jour
        if (!daySnap.exists) {
          transaction.set(dayRef, {
            date: today,
            total: 1,
            whatsapp: contactType === "whatsapp" ? 1 : 0,
            sms: contactType === "sms" ? 1 : 0,
            call: contactType === "call" ? 1 : 0,
          });
        } else {
          transaction.update(dayRef, {
            total: admin.firestore.FieldValue.increment(1),
            whatsapp: admin.firestore.FieldValue.increment(
              contactType === "whatsapp" ? 1 : 0,
            ),
            sms: admin.firestore.FieldValue.increment(
              contactType === "sms" ? 1 : 0,
            ),
            call: admin.firestore.FieldValue.increment(
              contactType === "call" ? 1 : 0,
            ),
          });
        }

        // Écrire l'événement dans la sous-collection
        transaction.set(newEventRef, {
          adId,
          contactType,
          userId,
          timestamp: new Date().toISOString(),
        });
      });

      return { success: true };
    } catch (error: any) {
      console.error("Erreur trackAdContact:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", error.message);
    }
  },
);
