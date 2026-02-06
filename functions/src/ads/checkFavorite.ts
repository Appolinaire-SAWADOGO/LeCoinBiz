import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

interface CheckFavoriteRequest {
  adId: string;
}

export const ifAdIsAddedToFavorites = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    const { adId } = request.data as CheckFavoriteRequest;

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

      return { added: !snapshot.empty };
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris", error);
      throw new HttpsError("internal", "Impossible de vérifier les favoris.");
    }
  },
);
