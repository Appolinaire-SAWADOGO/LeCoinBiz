import {
  addAdToInfiniteList,
  decrementCount,
  getAdToInfiniteList,
  incrementCount,
  modifyAdToQueryData,
  removeAdFromInfiniteList,
  showToast,
} from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useActivateAd = () => {
  const queryClient = useQueryClient();

  const activateAd = async (
    adId: string,
    userId: string,
    from: "NORMAL" | "AD_DETAILS",
  ) => {
    if (!adId) {
      showToast("error", "Annonce introuvable.");
      return null;
    }

    if (!userId) {
      return null;
    }

    showToast("loading", "Traitement en cours.");

    try {
      const activateAdFunction = firebaseFunctions.httpsCallable("activateAd");
      await activateAdFunction({ adId });

      const disabledAd = getAdToInfiniteList(
        ["user-disabled-ads", userId],
        adId,
        queryClient,
      );

      removeAdFromInfiniteList(
        ["user-disabled-ads", userId],
        adId,
        queryClient,
      );
      addAdToInfiniteList(
        ["user-activated-ads", userId],
        { ...disabledAd, status: "ACTIVATED" },
        queryClient,
      );
      decrementCount(["user-disabled-ads-count", userId], queryClient);
      incrementCount(["user-activated-ads-count", userId], queryClient);

      if (from === "AD_DETAILS") {
        modifyAdToQueryData(["ad", adId], { status: "ACTIVATED" }, queryClient);
      }

      Toast.hide();
      showToast("success", "Annonce activée.");
    } catch (error: any) {
      console.error("Erreur lors de l'activation de l'annonce :", error);
      Toast.hide();

      if (error.code === "unauthenticated") {
        showToast("error", "Vous devez être connecté.");
      } else if (error.code === "invalid-argument") {
        showToast("error", "Annonce introuvable.");
      } else {
        showToast("error", "Une erreur est survenue.");
      }
      return null;
    }
  };

  return { activateAd };
};
