import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();
const auth = admin.auth();

export const deleteAccount = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const userId = request.data?.userId;
      if (!userId) {
        throw new HttpsError("invalid-argument", "Aucun utilisateur fourni");
      }

      await db.collection("UserFcmTokens").doc(userId).delete();

      const [adsSnapshot, favSnapshot, reportsSnapshot] = await Promise.all([
        db.collection("Ads").where("userId", "==", userId).get(),
        db.collection("Favorites").where("userId", "==", userId).get(),
        db.collection("Reports").where("userId", "==", userId).get(),
      ]);

      const deletions = [
        ...adsSnapshot.docs.map((doc) => doc.ref.delete()),
        ...favSnapshot.docs.map((doc) => doc.ref.delete()),
        ...reportsSnapshot.docs.map((doc) => doc.ref.delete()),
        db.collection("Users").doc(userId).delete(),
      ];

      await Promise.all(deletions);

      await auth.deleteUser(userId);

      return { message: "success" };
    } catch (error: any) {
      console.error("Erreur suppression du compte :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);

