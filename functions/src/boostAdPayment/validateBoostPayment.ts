import * as functions from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

export const validateBoostPayment = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    const { paymentId, action } = request.data as {
      paymentId: string;
      action: "approve" | "reject";
    };

    if (!paymentId || !action) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "paymentId et action sont requis.",
      );
    }

    const paymentRef = db.collection("BoostPayments").doc(paymentId);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Paiement introuvable.",
      );
    }

    const paymentData = paymentSnap.data()!;

    // Idempotency : évite de re-traiter un paiement déjà validé
    if (paymentData.status !== "pending_verification") {
      return { status: "already_processed" };
    }

    if (action === "reject") {
      await paymentRef.update({
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { status: "rejected" };
    }

    const batch = db.batch();

    batch.update(paymentRef, {
      status: "completed",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const adRef = db.collection("Ads").doc(paymentData.adId);
    const boostExpiredAt = admin.firestore.Timestamp.fromDate(
      new Date(
        paymentData.startDate.toDate().getTime() +
          paymentData.days * 24 * 60 * 60 * 1000,
      ),
    );

    batch.update(adRef, {
      isBoosted: true,
      boostStartAt: paymentData.startDate,
      boostExpiredAt,
    });

    await batch.commit();

    return { status: "approved" };
  },
);
