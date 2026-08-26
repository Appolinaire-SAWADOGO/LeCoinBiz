import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";
import { BannerType } from "../../types";

export const getBoostAds = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async () => {
    try {
      const now = admin.firestore.Timestamp.now();

      const boostAdsSnapshot = await db
        .collection("Ads")
        .where("status", "==", "ACTIVATED")
        .where("isBoosted", "==", true)
        .where("boostExpiredAt", ">", now)
        .where("boostStartAt", "<", now)
        .limit(20)
        .get();

      const activeBoostAds = boostAdsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BannerType[];

      const shuffled = activeBoostAds
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

      return shuffled;
    } catch (error: any) {
      console.error("Erreur récupération des annonces boostées :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
