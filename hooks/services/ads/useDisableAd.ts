import {
  addAdToInfiniteList,
  decrementCount,
  getAdToInfiniteList,
  incrementCount,
  modifyAdToQueryData,
  removeAdFromInfiniteList,
  showToast,
} from "@/utils";
import functions from "@react-native-firebase/functions";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useDisableAd = () => {
  const queryClient = useQueryClient();

  const disableAd = async (
    adId: string,
    userId: string,
    from: "NORMAL" | "AD_DETAILS",
  ) => {
    if (!adId) {
      showToast("error", "Annonce introuvable.");
      return;
    }

    if (!userId) {
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      const disableAdFn = functions().httpsCallable("disableAd");
      await disableAdFn({ adId });

      const activateAd = getAdToInfiniteList(
        ["user-activated-ads", userId],
        adId,
        queryClient,
      );

      removeAdFromInfiniteList(
        ["user-activated-ads", userId],
        adId,
        queryClient,
      );
      addAdToInfiniteList(
        ["user-disabled-ads", userId],
        { ...activateAd, status: "DISABLED" },
        queryClient,
      );
      decrementCount(["user-activated-ads-count", userId], queryClient);
      incrementCount(["user-disabled-ads-count", userId], queryClient);

      const homeAd = getAdToInfiniteList(["home-ads"], adId, queryClient);

      if (homeAd) removeAdFromInfiniteList(["home-ads"], adId, queryClient);

      if (from === "AD_DETAILS") {
        modifyAdToQueryData(["ad", adId], { status: "DISABLED" }, queryClient);
      }

      Toast.hide();
      showToast("success", "Annonce désactivée.");
    } catch (error) {
      console.error("disableAd error:", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
    }
  };

  return { disableAd };
};
