import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";

export const postBanner = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    try {
      const { data } = request.data;

      const docId = uuidv4();

      const now = Timestamp.now();

      const EXPIRATION_DAYS = 30;

      const expiredAt = Timestamp.fromMillis(
        now.toMillis() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      );

      await db
        .collection("Banners")
        .doc(docId)
        .set({
          ...data,
          createdAt: now,
          expiredAt,
        });
    } catch (error: any) {
      console.error("Erreur posting banner :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
