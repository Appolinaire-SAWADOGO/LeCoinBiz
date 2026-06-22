import { onRequest } from "firebase-functions/v2/https";
import { admin } from "../../firebase";

export const dailyUpdateAdsClicks = onRequest(
  {
    region: "europe-southwest1",
    invoker: "public",
  },
  async (req, res) => {
    try {
      const db = admin.firestore();

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const oneDayAgoTimestamp = admin.firestore.Timestamp.fromDate(oneDayAgo);

      const adsSnapshot = await db
        .collection("Ads")
        .where("createdAt", ">=", oneDayAgoTimestamp)
        .get();

      if (adsSnapshot.empty) {
        res.status(200).json({
          success: true,
          message: "Aucune annonce trouvée dans les 24 derniers heures.",
          updated: 0,
        });
        return;
      }

      const batch = db.batch();
      let updatedCount = 0;

      adsSnapshot.forEach((doc) => {
        const data = doc.data();
        const currentClicks = data?.stats?.clicks ?? 0;

        if (currentClicks >= 100) return;

        const randomClicks = Math.floor(Math.random() * (200 - 100 + 1)) + 100;

        batch.update(doc.ref, {
          "stats.clicks": randomClicks,
        });

        updatedCount++;
      });

      if (updatedCount === 0) {
        res.status(200).json({
          success: true,
          message: "Toutes les annonces récentes ont déjà 100 clicks ou plus.",
          updated: 0,
        });
        return;
      }

      await batch.commit();

      res.status(200).json({
        success: true,
        message: `${updatedCount} annonce(s) avec moins de 100 clicks mise(s) à jour.`,
        updated: updatedCount,
      });
    } catch (error: any) {
      console.error("Erreur dailyUpdateAdsClicks :", error?.message);
      res.status(500).json({ success: false, error: error?.message });
    }
  },
);
