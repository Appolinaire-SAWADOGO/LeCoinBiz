import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

interface AddFavoriteRequest {
  adId: string;
}

export const addAdFavorite = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    const { adId } = request.data as AddFavoriteRequest;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Vous devez être connecté.");
    }

    const userId = request.auth.uid;

    if (!adId) {
      throw new HttpsError("invalid-argument", "Annonce introuvable.");
    }

    try {
      const snapshot = await db
        .collection("Favorites")
        .where("adId", "==", adId)
        .where("userId", "==", userId)
        .get();

      const isAlreadyAdded = !snapshot.empty;

      if (isAlreadyAdded) {
        await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
      } else {
        const docId = uuidv4();
        await db.collection("Favorites").doc(docId).set({
          adId,
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return { success: true, added: !isAlreadyAdded };
    } catch (error) {
      console.error("Erreur lors de l'ajout/suppression des favoris", error);
      throw new HttpsError("internal", "Impossible de modifier les favoris.");
    }
  },
);
