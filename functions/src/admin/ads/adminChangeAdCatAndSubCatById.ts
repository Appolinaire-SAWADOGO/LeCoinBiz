import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../../firebase";

export const adminChangeAdCatAndSubCatById = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    const { adId, category, subCategory } = request.data;

    if (!adId || !category || !subCategory) {
      throw new HttpsError(
        "invalid-argument",
        "adId, category et subCategory sont requis.",
      );
    }

    try {
      const adRef = db.collection("Ads").doc(adId);
      const snap = await adRef.get();

      if (!snap.exists) {
        throw new HttpsError("not-found", "Annonce introuvable.");
      }

      const updatePayload: Record<string, unknown> = {
        category,
        subCategory,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await adRef.update(updatePayload);

      return { success: true };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("adminEditAdCategory error:", error);
      throw new HttpsError("internal", "Impossible de modifier la catégorie.");
    }
  },
);
