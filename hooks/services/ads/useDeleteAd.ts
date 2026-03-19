import { decrementCount, removeAdFromInfiniteList, showToast } from "@/utils";
import { firebasyeFunctions } from "@/utils/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useDeleteImgs } from "./useDeleteImgs";

export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  const { deleteImgs } = useDeleteImgs();

  const deleteAd = async (
    adId: string,
    userId: string,
    images: string[],
    adStatus: "PENDING" | "DISABLED" | "ACTIVATED",
    from: "NORMAL" | "AD_DETAILS",
    video?: string, // ← NOUVEAU
  ) => {
    if (!adId) {
      showToast("error", "Annonce introuvable.");
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      const deleteAdFunction = firebasyeFunctions.httpsCallable("deleteAd");
      const result = await deleteAdFunction({ adId, adStatus });
      const { success, adStatus: status } = result.data as {
        success: boolean;
        adStatus: "PENDING" | "DISABLED" | "ACTIVATED";
      };

      if (success) {
        const filesToDelete = video ? [...images, video] : images;
        await deleteImgs(filesToDelete);

        if (status === "DISABLED") {
          decrementCount(["user-disabled-ads-count", userId], queryClient);
          removeAdFromInfiniteList(
            ["user-disabled-ads", userId],
            adId,
            queryClient,
          );
        } else if (status === "PENDING") {
          decrementCount(["user-pending-ads-count", userId], queryClient);
          removeAdFromInfiniteList(
            ["user-pending-ads", userId],
            adId,
            queryClient,
          );
        }

        Toast.hide();
        showToast("success", "Annonce supprimée.");

        if (from === "AD_DETAILS") router.back();
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'annonce :", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
    }
  };

  return { deleteAd };
};
