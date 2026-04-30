import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin } from "../../firebase";

export const checkUserExistsByEmail = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { email } = request.data;

      if (!email) {
        throw new HttpsError("invalid-argument", "Email requis");
      }

      const snapshot = await admin
        .firestore()
        .collection("Users")
        .where("email", "==", email)
        .get();

      return { exists: !snapshot.empty };
    } catch (error: any) {
      console.error("Erreur getUserByEmail:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError("internal", error.message);
    }
  },
);
