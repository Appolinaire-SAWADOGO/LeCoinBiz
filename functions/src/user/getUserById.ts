import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const getUserById = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { id } = request.data as { id: string };

      if (!id) {
        throw new HttpsError("invalid-argument", "ID utilisateur manquant");
      }

      const userSnap = await db.collection("Users").doc(id).get();

      if (!userSnap.exists) {
        throw new HttpsError("not-found", "Utilisateur introuvable");
      }

      return {
        id: userSnap.id,
        ...userSnap.data(),
      };
    } catch (error: any) {
      console.error("Erreur getUserById:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError("internal", error.message);
    }
  },
);
