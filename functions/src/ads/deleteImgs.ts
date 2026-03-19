import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";


export const deleteImgs = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Non authentifié");
    }

    const { imgs } = request.data as { imgs: string[] };

    if (!imgs || !Array.isArray(imgs) || imgs.length === 0) {
      throw new HttpsError("invalid-argument", "Images invalides");
    }

    const bucket = admin.storage().bucket();

    try {
      const deletePromises = imgs.map(async (url) => {
        const decodedUrl = decodeURIComponent(url);
        const match = decodedUrl.match(/\/o\/(.*?)\?/);

        if (!match || !match[1]) return;

        const filePath = match[1];
        await bucket.file(filePath).delete();
      });

      await Promise.all(deletePromises);

      return { success: true };
    } catch (error) {
      console.error("Erreur suppression images :", error);
      throw new HttpsError("internal", "Impossible de supprimer les images");
    }
  },
);

