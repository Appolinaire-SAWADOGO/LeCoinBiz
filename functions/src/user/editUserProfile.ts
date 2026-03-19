import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";


const db = getFirestore();
const auth = getAuth();

export const editUserProfile = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const uid = request.auth?.uid;

    if (!uid) {
      throw new HttpsError("unauthenticated", "Utilisateur non authentifié");
    }

    const { firstAndLastName, userName, gender, dateOfBirth, image } =
      request.data;

    const updates: any = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (userName !== undefined) updates.userName = userName;

    if (firstAndLastName !== undefined)
      updates.firstAndLastName = firstAndLastName;

    if (gender !== undefined) updates.gender = gender;

    if (image !== undefined) updates.image = image;

    if (dateOfBirth !== undefined) {
      const date = new Date(dateOfBirth);

      if (isNaN(date.getTime())) {
        throw new HttpsError("invalid-argument", "dateOfBirth invalide");
      }

      updates.dateOfBirth = admin.firestore.Timestamp.fromDate(date);
    }

    try {
      await db.collection("Users").doc(uid).update(updates);

      if (userName !== undefined) {
        await auth.updateUser(uid, {
          displayName: userName,
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("updateUserProfile error:", error);
      throw new HttpsError("internal", "Erreur lors de la mise à jour");
    }
  },
);

