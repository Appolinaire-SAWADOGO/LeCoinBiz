import * as functions from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";
import { sendUserNotification } from "../../utils/notifications";

export const validateBoostPayment = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    try {
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

      // pending_verification || failed || completed
      if (paymentData.status !== "pending_verification") {
        return { status: "already_processed" };
      }

      const batch = db.batch();

      const adRef = db.collection("Ads").doc(paymentData.adId);

      if (action === "reject") {
        batch.update(paymentRef, {
          status: "failed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        batch.update(adRef, {
          boostStatus: admin.firestore.FieldValue.delete(),
          pendingBoostPaymentId: admin.firestore.FieldValue.delete(),
        });

        await batch.commit();

        return { status: "rejected" };
      }

      batch.update(paymentRef, {
        status: "completed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const boostExpiredAt = admin.firestore.Timestamp.fromDate(
        new Date(
          paymentData.startDate.toDate().getTime() +
            paymentData.days * 24 * 60 * 60 * 1000,
        ),
      );

      const boostStartMs = paymentData.startDate.toDate().getTime();
      const nowMs = Date.now();

      batch.update(adRef, {
        boostStartAt: paymentData.startDate,
        boostExpiredAt,
        boostStatus: boostStartMs <= nowMs ? "active" : "scheduled",
        pendingBoostPaymentId: admin.firestore.FieldValue.delete(),
      });

      await batch.commit();

      const notifTitle = "Boost activé 🎉";
      const notifBody = `Votre paiement pour le boost de l'annonce « ${paymentData.adId} » a été vérifié et accepté. Votre boost pour ${paymentData.days} jour${paymentData.days > 1 ? "s" : ""} est maintenant actif.`;

      await sendUserNotification({
        title: notifTitle,
        body: notifBody,
        userId: paymentData.userId,
      });

      return { status: "approved" };
    } catch (error: any) {
      console.error("Erreur  l'ors de la validation du boost payment :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
