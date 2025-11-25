import { showToast } from "@/functions";
import { AdStatusType } from "@/types";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  const deleteAd = async (adId: string, adStatus: AdStatusType) => {
    if (!adId) {
      showToast("error", "Annonce introuvable.");
      return;
    }

    if (adStatus === "ACTIVATED") {
      showToast("error", "Vous ne pouvez pas supprimer une annonce activée.");
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      await firestore().collection("Ads").doc(adId).delete();

      if (adStatus === "DISABLED") {
        await queryClient.invalidateQueries({
          queryKey: ["user-disabled-ads-count"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["user-disabled-ads"],
        });
      } else if (adStatus === "PENDING") {
        await queryClient.invalidateQueries({
          queryKey: ["user-pending-ads-count"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["user-pending-ads"],
        });
      }

      Toast.hide();
      showToast("success", "Annonce supprimée.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce :", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
      return;
    }
  };

  return { deleteAd };
};
