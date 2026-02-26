import admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

export const deleteAd = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    const { auth, data } = request;

    if (!auth) {
      throw new HttpsError("unauthenticated", "Utilisateur non authentifié");
    }

    const { adId, adStatus } = data as {
      adId: string;
      adStatus: "PENDING" | "DISABLED" | "ACTIVATED";
    };

    if (!adId || !adStatus) {
      throw new HttpsError("invalid-argument", "Paramètres invalides");
    }

    const userId = auth.uid;
    const db = admin.firestore();

    const adRef = db.collection("Ads").doc(adId);
    const adSnap = await adRef.get();

    if (!adSnap.exists) {
      throw new HttpsError("not-found", "Annonce introuvable");
    }

    const adData = adSnap.data();

    if (adData?.userId !== userId) {
      throw new HttpsError("permission-denied", "Action non autorisée");
    }

    const batch = db.batch();

    batch.delete(adRef);

    const favSnap = await db
      .collection("Favorites")
      .where("adId", "==", adId)
      .get();

    favSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    return {
      success: true,
      adStatus,
    };
  },
);
