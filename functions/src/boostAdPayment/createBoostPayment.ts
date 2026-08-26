import * as functions from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

const OPERATORS = ["orange", "moov"] as const;
type OperatorKey = (typeof OPERATORS)[number];

export const declareBoostPayment = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Utilisateur non authentifié.",
      );
    }

    const { adId, days, price, startDate, operator, phoneNumber } =
      request.data as {
        adId: string;
        days: number;
        price: number;
        startDate: string;
        operator: OperatorKey;
        phoneNumber: string;
      };

    if (!adId || !days || !price || !operator || !phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Champs manquants pour déclarer le paiement.",
      );
    }

    if (!OPERATORS.includes(operator)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Opérateur invalide.",
      );
    }

    const userId = request.auth.uid;

    const paymentRef = db.collection("BoostPayments").doc();
    await paymentRef.set({
      adId,
      userId,
      days,
      price,
      startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      operator,
      phoneNumber,
      status: "pending_verification",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { paymentId: paymentRef.id };
  },
);
