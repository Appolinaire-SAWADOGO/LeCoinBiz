import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

export const trackDailyOpen = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { deviceId } = request.data as { deviceId: string };
      const userId = request.auth?.uid ?? null;
      const isAuthenticated = !!userId;

      if (!deviceId) {
        throw new HttpsError("invalid-argument", "deviceId manquant");
      }

      const today = new Date().toISOString().split("T")[0];
      const dayRef = db.collection("DailyOpens").doc(today);
      const deviceRef = dayRef.collection("DailyOpensDevices").doc(deviceId);

      await db.runTransaction(async (transaction) => {
        const [daySnap, deviceSnap] = await Promise.all([
          transaction.get(dayRef),
          transaction.get(deviceRef),
        ]);

        // Créer ou initialiser le document du jour
        if (!daySnap.exists) {
          transaction.set(dayRef, {
            date: today,
            total: 1,
            authenticated: isAuthenticated ? 1 : 0,
            anonymous: isAuthenticated ? 0 : 1,
          });
        } else if (!deviceSnap.exists) {
          // Device pas encore tracké aujourd'hui → incrémenter les compteurs
          transaction.update(dayRef, {
            total: admin.firestore.FieldValue.increment(1),
            authenticated: admin.firestore.FieldValue.increment(
              isAuthenticated ? 1 : 0,
            ),
            anonymous: admin.firestore.FieldValue.increment(
              isAuthenticated ? 0 : 1,
            ),
          });
        }

        // Écrire dans la sous-collection seulement si nouveau device
        if (!deviceSnap.exists) {
          transaction.set(deviceRef, {
            deviceId,
            userId,
            isAuthenticated,
            trackedAt: new Date().toISOString(),
          });
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error("Erreur trackDailyOpen:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", error.message);
    }
  },
);
