import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const adminGetReportAds = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    try {
      const reportsSnapshot = await db
        .collection("Reports")
        .orderBy("createdAt", "asc")
        .limit(30)
        .get();

      const adIds = new Set<string>();

      for (const doc of reportsSnapshot.docs) {
        const { adId } = doc.data();
        if (adId) adIds.add(adId);
      }

      const reportCountByAd: Record<string, number> = {};

      await Promise.all(
        Array.from(adIds).map(async (adId) => {
          const countSnap = await db
            .collection("Reports")
            .where("adId", "==", adId)
            .count()
            .get();

          reportCountByAd[adId] = countSnap.data().count;
        }),
      );

      const ads: any = [];

      await Promise.all(
        Object.keys(reportCountByAd).map(async (adId) => {
          const adSnap = await db.collection("Ads").doc(adId).get();
          if (!adSnap.exists) return;

          ads.push({
            id: adId,
            ...adSnap.data(),
            reportCount: reportCountByAd[adId],
          });
        }),
      );

      return { ads };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des annonces signalées:",
        error,
      );
      throw new HttpsError(
        "internal",
        "Impossible de récupérer les annonces signalées.",
      );
    }
  },
);
