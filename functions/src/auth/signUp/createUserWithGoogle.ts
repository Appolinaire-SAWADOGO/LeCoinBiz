import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin } from "../../../firebase";

export const createUserWithGoogle = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Non authentifié");
    }

    const uid = request.auth.uid;
    const {
      userName,
      firstAndLastName,
      image,
      phoneNumber,
      whatsappNumber,
      email,
      city,
    } = request.data;

    try {
      const userRef = admin.firestore().collection("Users").doc(uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        return { created: false };
      }

      await userRef.set({
        userName,
        firstAndLastName,
        image,
        location: {
          country: "burkina faso",
          city,
        },
        phoneNumber,
        whatsappNumber,
        email,
        authMethod: "GOOGLE",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { created: true };
    } catch (error: any) {
      console.error("Erreur création user google:", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
