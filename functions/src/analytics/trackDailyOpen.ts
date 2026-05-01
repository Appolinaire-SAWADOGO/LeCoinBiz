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
      const docRef = db.collection("daily_opens").doc(today);

      await db.runTransaction(async (transaction) => {
        const snap = await transaction.get(docRef);

        if (!snap.exists) {
          transaction.set(docRef, {
            date: today,
            total: 1,
            authenticated: isAuthenticated ? 1 : 0,
            anonymous: isAuthenticated ? 0 : 1,
            devices: [{ deviceId, userId, isAuthenticated }],
          });
        } else {
          const data = snap.data()!;
          const devices: { deviceId: string }[] = data.devices || [];
          const alreadyTracked = devices.some((d) => d.deviceId === deviceId);

          if (!alreadyTracked) {
            transaction.update(docRef, {
              total: admin.firestore.FieldValue.increment(1),
              authenticated: admin.firestore.FieldValue.increment(
                isAuthenticated ? 1 : 0,
              ),
              anonymous: admin.firestore.FieldValue.increment(
                isAuthenticated ? 0 : 1,
              ),
              devices: admin.firestore.FieldValue.arrayUnion({
                deviceId,
                userId,
                isAuthenticated,
              }),
            });
          }
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
