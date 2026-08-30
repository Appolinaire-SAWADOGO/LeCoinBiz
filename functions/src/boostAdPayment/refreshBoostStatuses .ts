import { onRequest } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

export const refreshBoostStatuses = onRequest(
  {
    region: "europe-southwest1",
    invoker: "public",
  },
  async (req, res) => {
    try {
      const now = admin.firestore.Timestamp.now();

      // Récupérer quelques annonces récentes pour le contexte
      const expiredBoostAdsSnapshot = await db
        .collection("Ads")
        .where("boostStatus", "==", "active")
        .where("boostExpiredAt", "<=", now)
        .get();

      if (expiredBoostAdsSnapshot.empty) {
        res.status(200).json({
          success: true,
          expired: 0,
        });
        return;
      }

      const batch = db.batch();

      expiredBoostAdsSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          boostStatus: "expired",
        });
      });

      await batch.commit();

      res
        .status(200)
        .json({ success: true, expired: expiredBoostAdsSnapshot.size });
    } catch (error: any) {
      console.error("Erreur refreshBoostStatuses :", error?.message);
      res.status(500).json({ success: false, error: error?.message });
    }
  },
);
