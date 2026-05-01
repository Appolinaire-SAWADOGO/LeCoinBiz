import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";

export const getDailyOpenStats = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const { from, to } = request.data as { from: string; to: string };

      if (!from || !to) {
        throw new HttpsError("invalid-argument", "Dates manquantes");
      }

      const snap = await db
        .collection("daily_opens")
        .where("date", ">=", from)
        .where("date", "<=", to)
        .orderBy("date", "asc")
        .get();

      const stats = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          date: data.date,
          total: data.total,
          authenticated: data.authenticated,
          anonymous: data.anonymous,
        };
      });

      return { stats };
    } catch (error: any) {
      console.error("Erreur getDailyOpenStats:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", error.message);
    }
  },
);
