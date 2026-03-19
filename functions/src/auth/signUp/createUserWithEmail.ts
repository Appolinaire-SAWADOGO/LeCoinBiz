import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

interface CreateUserParams {
  uid: string;
  userName: string;
  email: string;
}

export const createUserWithEmail = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { uid, userName, email } = request.data as CreateUserParams;

    if (!uid || !userName || !email) {
      throw new HttpsError("invalid-argument", "Paramètres manquants");
    }

    try {
      await db
        .collection("Users")
        .doc(uid)
        .set({
          userName,
          email,
          location: { country: "burkina faso", city: "ouagadougou" },
          authMethod: "EMAIL_PASSWORD",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return { message: "success" };
    } catch (error: any) {
      console.error("Erreur création user:", error);
      throw new HttpsError("internal", error.message);
    }
  },
);

