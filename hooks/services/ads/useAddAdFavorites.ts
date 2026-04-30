import { AnnouncementType } from "@/types";
import {
  addAdToInfiniteList,
  removeAdFromInfiniteList,
  showToast,
} from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useAddAdFavorites = () => {
  const queryClient = useQueryClient();

  const userId = useCurrentUser()?.uid;

  const addAdFavorites = async (adId: string, ad: AnnouncementType) => {
    if (!userId) return null;

    if (!adId) return null;

    showToast("loading", "Traitement en cours.", 0);

    try {
      const addFavoriteFunction =
        firebaseFunctions.httpsCallable("addAdFavorite");
      const result = await addFavoriteFunction({ adId });

      const { added } = result.data as { success: boolean; added: boolean };

      queryClient.setQueryData(["if-ad-is-added-to-favorites", adId], added);

      if (added) {
        addAdToInfiniteList(["user-favorites", userId], ad, queryClient);
      } else {
        removeAdFromInfiniteList(["user-favorites", userId], adId, queryClient);
      }

      Toast.hide();
      showToast(
        "success",
        added
          ? "Annonce ajoutée aux favoris !"
          : "Annonce supprimée des favoris !",
        0,
      );
    } catch (error: any) {
      console.error(
        "Erreur lors de la modification des favoris :",
        error.message,
      );
      Toast.hide();
      showToast("error", "Une erreur est survenue.", 0);
    }
  };

  return { addAdFavorites };
};
