import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

const bucket = admin.storage().bucket();

export const editAd = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { adId, updates, deletedImages } = request.data;
    const userId = request.auth?.uid;

    if (!userId) {
      throw new HttpsError("unauthenticated", "Utilisateur non authentifié.");
    }

    if (!adId || !updates) {
      throw new HttpsError("invalid-argument", "Données invalides.");
    }

    try {
      const adRef = db.collection("Ads").doc(adId);
      const snap = await adRef.get();

      if (!snap.exists) {
        throw new HttpsError("not-found", "Annonce introuvable.");
      }

      const adData = snap.data();

      if (adData?.userId !== userId) {
        throw new HttpsError("permission-denied", "Action non autorisée.");
      }

      await adRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Supprimer les anciennes images
      if (Array.isArray(deletedImages)) {
        const deletePromises = deletedImages.map(async (url: string) => {
          try {
            const decoded = decodeURIComponent(url);
            const match = decoded.match(/\/o\/(.*?)\?/);
            if (!match?.[1]) return;

            await bucket.file(match[1]).delete();
          } catch (e) {
            console.error("Image delete error:", e);
          }
        });

        await Promise.all(deletePromises);
      }

      return { success: true };
    } catch (error) {
      console.error("editAd error:", error);
      throw new HttpsError("internal", "Impossible de modifier l'annonce.");
    }
  },
);
