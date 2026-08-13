import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";
import { BannerType } from "../../types";

export const getBanners = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async () => {
    try {
      const now = admin.firestore.Timestamp.now();

      const bannersSnapshot = await db
        .collection("Banners")
        .where("expiredAt", ">", now)
        .get();

      const activeBanners = bannersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BannerType[];

      return activeBanners;
    } catch (error: any) {
      console.error("Erreur récupération des bannières :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
