import { useNotificationStore } from "@/store/useNotificationStore";
import { AdBoostStatusType } from "@/types";
import {
  addNotificationToQueryData,
  modifyAdToInfiniteList,
  modifyAdToQueryData,
  showToast,
} from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { useQueryClient } from "@tanstack/react-query";

type Operator = "orange" | "moov";

type CreateBoostPaymentParams = {
  adId: string;
  userId: string;
  adTitle: string;
  adBoostStatus?: AdBoostStatusType;
  days: number;
  price: number;
  startDate: Date;
  operator: Operator;
  phoneNumber: string;
};

export const useCreateBoostPayment = () => {
  /**
   * Crée juste un "dossier de paiement" en attente de vérification MANUELLE.
   * Aucun agrégateur n'est appelé ici — c'est toi qui valideras plus tard
   * (via validateBoostPayment) après avoir vérifié la réception de l'argent.
   */

  const queryClient = useQueryClient();

  const { setHasNotifications } = useNotificationStore();

  const createBoostPayment = async (
    params: CreateBoostPaymentParams,
  ): Promise<string | null> => {
    if (params.adBoostStatus && params.adBoostStatus !== "expired") return null;

    try {
      const createBoostPaymentFn =
        firebaseFunctions.httpsCallable("createBoostPayment");

      const result = await createBoostPaymentFn({
        adId: params.adId,
        adTitle: params.adTitle,
        adBoostStatus: params.adBoostStatus,
        days: params.days,
        price: params.price,
        startDate: params.startDate.toISOString(),
        operator: params.operator,
        phoneNumber: params.phoneNumber,
      });

      setHasNotifications(true);

      modifyAdToInfiniteList(
        ["user-activated-ads", params.userId],
        { id: params.adId, boostStatus: "pending_verification" },
        queryClient,
      );

      addNotificationToQueryData(
        queryClient,
        {
          title: "Paiement en cours de vérification",
          body: `Votre déclaration de paiement pour le boost de l'annonce « ${params.adTitle} » pour ${params.days} jour${params.days > 1 ? "s" : ""} a bien été reçue. Votre boost sera activé après vérification.`,
          type: "USER_NOTIFICATION",
        },
        params.userId,
      );

      modifyAdToQueryData(
        ["ad", params.adId],
        { boostStatus: "pending_verification" },
        queryClient,
      );

      const { paymentId } = result.data as { paymentId: string };

      return paymentId;
    } catch (error: any) {
      console.error("Erreur lors de la creation du paiement :", error);

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

  return { createBoostPayment };
};
