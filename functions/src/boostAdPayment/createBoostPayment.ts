import * as functions from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";
import { admin, db } from "../../firebase";
import {
  sendAdminNotification,
  sendUserNotification,
} from "../../utils/notifications";

const OPERATORS = ["orange", "moov"] as const;
type OperatorKey = (typeof OPERATORS)[number];

export const createBoostPayment = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
  },
  async (request) => {
    try {
      if (!request.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilisateur non authentifié.",
        );
      }

      const { adId, adTitle, days, price, startDate, operator, phoneNumber } =
        request.data as {
          adId: string;
          adTitle: string;
          days: number;
          price: number;
          startDate: string;
          operator: OperatorKey;
          phoneNumber: string;
        };

      if (!adId || !adTitle || !days || !price || !operator || !phoneNumber) {
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

      const adRef = db.collection("Ads").doc(adId);
      const adSnap = await adRef.get();

      if (!adSnap.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Annonce introuvable.",
        );
      }

      const adData = adSnap.data()!;
      const currentBoostStatus = adData.boostStatus;

      if (currentBoostStatus && currentBoostStatus !== "expired") {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Cette annonce a déjà un boost en cours ou en attente.",
        );
      }

      const batch = db.batch();

      const docId = uuidv4();

      const paymentRef = db.collection("BoostPayments").doc(docId);
      batch.set(paymentRef, {
        adId,
        adTitle,
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

      batch.update(adRef, {
        boostStatus: "pending_verification",
        pendingBoostPaymentId: paymentRef.id,
      });

      await batch.commit();

      //  notification 1 pour l'admin
      const adminTitle = "Nouveau paiement de boost à vérifier";
      const adminBody = `${price} FCFA déclaré depuis le ${phoneNumber} pour un boost de ${days} jour${days > 1 ? "s" : ""}.`;

      await sendAdminNotification({ title: adminTitle, body: adminBody });

      // notification 2 pour l'user
      const userTitle = "Paiement en cours de vérification";
      const userBody = `Votre déclaration de paiement pour le boost de l'annonce « ${adTitle} » pour ${days} jour${days > 1 ? "s" : ""} a bien été reçue. Votre boost sera activé après vérification.`;

      await sendUserNotification({ title: userTitle, body: userBody, userId });

      return { paymentId: paymentRef.id };
    } catch (error: any) {
      console.error("Erreur  l'ors de la creation du boost payment :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
