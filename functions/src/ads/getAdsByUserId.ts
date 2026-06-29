import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

const db = admin.firestore();
const PAGE_SIZE = 10;

interface PageParam {
  path: string;
}

export const getAdsByUserId = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const {
      userId,
      status = "ACTIVATED",
      pageParam: pageParamRaw,
    } = request.data;

    if (!userId) {
      throw new HttpsError("invalid-argument", "Utilisateur introuvable.");
    }

    const pageParam: PageParam | null =
      pageParamRaw &&
      typeof pageParamRaw.path === "string" &&
      pageParamRaw.path.trim() !== ""
        ? pageParamRaw
        : null;

    try {
      let query = db
        .collection("Ads")
        .where("userId", "==", userId)
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (pageParam) {
        const lastDoc = await db.doc(pageParam.path).get();
        if (!lastDoc.exists) {
          throw new HttpsError(
            "not-found",
            "Document de pagination introuvable.",
          );
        }
        query = query.startAfter(lastDoc);
      }

      const snap = await query.get();

      const ads = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastDocSnap = snap.docs[snap.docs.length - 1] || null;

      return {
        ads,
        lastDoc: lastDocSnap ? { path: lastDocSnap.ref.path } : null,
        hasMore: snap.docs.length === PAGE_SIZE,
      };
    } catch (error) {
      console.error("getAdsByUserId error:", error);
      throw new HttpsError("internal", "Impossible de récupérer les annonces.");
    }
  },
);
