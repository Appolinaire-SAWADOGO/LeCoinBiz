import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

interface CreateUserWithPhoneParams {
  uid: string;
  phoneNumber: string;
}

export const createUserWithPhone = onCall(
  { consumeAppCheckToken: false, region: "africa-south1" },
  async (request) => {
    const { uid, phoneNumber } = request.data as CreateUserWithPhoneParams;

    if (!uid || !phoneNumber) {
      throw new HttpsError("invalid-argument", "Paramètres manquants");
    }

    try {
      await db
        .collection("Users")
        .doc(uid)
        .set({
          location: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          authMethod: "PHONE_NUMBER",
          phoneNumber,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return { success: true };
    } catch (error: any) {
      console.error("Erreur création user phone:", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
