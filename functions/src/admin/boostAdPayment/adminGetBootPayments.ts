import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../../firebase";

export const adminGetBoostPayments = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async () => {
    try {
      const boostAdsSnapshot = await db
        .collection("BoostPayments")
        .where("status", "==", "pending_verification")
        .get();

      const activeBoostAds = boostAdsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return activeBoostAds;
    } catch (error: any) {
      console.error("Erreur récupération des paiements en attente :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
