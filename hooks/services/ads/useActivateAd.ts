import { showToast } from "@/utils";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useActivateAd = () => {
  const queryClient = useQueryClient();

  const activateAd = async (adId: string, from: "NORMAL" | "AD_DETAILS") => {
    if (!adId) {
      showToast("error", "Annonce introuvable.");
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      await firestore()
        .collection("Ads")
        .doc(adId)
        .update({ status: "ACTIVATED" });

      await queryClient.invalidateQueries({
        queryKey: ["user-activated-ads-count"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-disabled-ads-count"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-activated-ads"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-disabled-ads"],
      });

      if (from === "AD_DETAILS") {
        await queryClient.invalidateQueries({
          queryKey: ["ad", adId],
        });
      }

      Toast.hide();
      showToast("success", "Annonce activée.");
    } catch (error) {
      console.error("Erreur lors de la activation de l'annonce :", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
      return;
    }
  };

  return { activateAd };
};
