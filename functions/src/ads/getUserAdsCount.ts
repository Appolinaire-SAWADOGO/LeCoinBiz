import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const getUserAdsCount = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    try {
      const userId: string = request.data?.userId;
      const status: string = request.data?.status || "ACTIVATED";

      if (!userId) {
        throw new HttpsError("invalid-argument", "Aucun ID utilisateur fourni");
      }

      const rslt = await db
        .collection("Ads")
        .where("userId", "==", userId)
        .where("status", "==", status)
        .count()
        .get();

      return { count: rslt.data().count };
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération du nombre d'annonces :",
        error,
      );
      throw new HttpsError("internal", error.message);
    }
  },
);
