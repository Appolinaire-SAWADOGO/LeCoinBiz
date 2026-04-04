import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../../firebase";

export const adminGetUsers = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async () => {
    try {
      const usersSnapshot = await db.collection("Users").get();

      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        users,
        total: users.length,
      };
    } catch (error) {
      console.error("Erreur lors de la recuperation des utilisateurs:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "Impossible de recuperer la liste des utilisateurs.",
      );
    }
  },
);
