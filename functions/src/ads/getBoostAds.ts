import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";
import { AnnouncementType } from "../../types";
import { prioritizeBoostedAds } from "../../utils/ranking";

export const getBoostAds = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async () => {
    try {
      const boostAdsSnapshot = await db
        .collection("Ads")
        .where("status", "==", "ACTIVATED")
        .where("boostStatus", "==", "active")
        .limit(20)
        .get();

      const activeBoostAds = boostAdsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AnnouncementType[];

      const rankedBoostAds = prioritizeBoostedAds(activeBoostAds, 2, 1).slice(
        0,
        8,
      );

      return rankedBoostAds;
    } catch (error: any) {
      console.error("Erreur récupération des annonces boostées :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
