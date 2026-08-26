import { showToast } from "@/utils";
import { firebaseFirestore, firebaseFunctions } from "@/utils/firebase";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import { useRef } from "react";

type Operator = "orange" | "moov";

type DeclareBoostPaymentParams = {
  adId: string;
  days: number;
  price: number;
  startDate: Date;
  operator: Operator;
  phoneNumber: string;
};

// pending_verification : le client a déclaré avoir payé, en attente de ta vérification manuelle
type BoostPaymentStatus = "pending_verification" | "completed" | "failed";

export const useBoostPayment = () => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Crée juste un "dossier de paiement" en attente de vérification MANUELLE.
   * Aucun agrégateur n'est appelé ici — c'est toi qui valideras plus tard
   * (via validateBoostPayment) après avoir vérifié la réception de l'argent.
   */
  const declareBoostPayment = async (
    params: DeclareBoostPaymentParams,
  ): Promise<string | null> => {
    try {
      const declareBoostPaymentFunction = firebaseFunctions.httpsCallable(
        "declareBoostPayment",
      );

      const result = await declareBoostPaymentFunction({
        adId: params.adId,
        days: params.days,
        price: params.price,
        startDate: params.startDate.toISOString(),
        operator: params.operator,
        phoneNumber: params.phoneNumber,
      });

      const { paymentId } = result.data as { paymentId: string };
      return paymentId;
    } catch (error: any) {
      console.error("Erreur lors de la déclaration du paiement :", error);

      if (error.code === "unauthenticated") {
        showToast("error", "Vous devez être connecté.");
      } else if (error.code === "invalid-argument") {
        showToast("error", "Informations de paiement invalides.");
      } else {
        showToast("error", "Une erreur est survenue.");
      }
      return null;
    }
  };

  /**
   * Écoute le document boostPayments/{paymentId}. Ce document ne change
   * de statut QUE lorsque toi (l'admin) tu le valides manuellement via
   * la fonction validateBoostPayment (ou directement dans Firestore).
   */
  const subscribeToPaymentStatus = (
    paymentId: string,
    callbacks: {
      onCompleted: () => void;
      onFailed: () => void;
    },
  ) => {
    unsubscribeRef.current?.();

    const paymentRef = doc(firebaseFirestore, "BoostPayments", paymentId);

    const unsubscribe = onSnapshot(
      paymentRef,
      (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        const status = data.status as BoostPaymentStatus;

        if (status === "completed") {
          callbacks.onCompleted();
          unsubscribeRef.current?.();
        } else if (status === "failed") {
          showToast(
            "error",
            "Paiement non confirmé. Vérifiez le numéro utilisé ou contactez le support.",
          );
          callbacks.onFailed();
          unsubscribeRef.current?.();
        }
        // pending_verification : on continue d'attendre
      },
      (error) => {
        console.error("Erreur d'écoute du paiement :", error);
        showToast("error", "Impossible de vérifier le statut du paiement.");
        callbacks.onFailed();
      },
    );

    unsubscribeRef.current = unsubscribe;
  };

  const cancelSubscription = () => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  };

  return { declareBoostPayment, subscribeToPaymentStatus, cancelSubscription };
};
