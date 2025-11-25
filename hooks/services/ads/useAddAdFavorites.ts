import { showToast } from "@/functions";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";

export const useAddAdFavorites = () => {
  const queryClient = useQueryClient();

  const currentUser = auth().currentUser;
  const userId = currentUser?.uid;

  const ifAdIsAddedToFavorites = async (adId: string) => {
    if (!userId) {
      return false;
    }

    try {
      const snapshot = await firestore()
        .collection("Favorites")
        .where("adId", "==", adId)
        .where("userId", "==", userId)
        .get();

      return !snapshot.empty;
    } catch (error) {
      console.error(
        "Erreur lors de la recherche si l'annonce est dans les favoris",
        error
      );
      return false;
    }
  };

  const addAdFavorites = async (adId: string) => {
    if (!userId) {
      showToast("error", "Connectez-vous pour ajouter aux favoris.");
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      const snapshot = await firestore()
        .collection("Favorites")
        .where("adId", "==", adId)
        .where("userId", "==", userId)
        .get();

      const isAlreadyAdded = !snapshot.empty;

      if (isAlreadyAdded) {
        await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
      } else {
        const docId = uuidv4();
        await firestore().collection("Favorites").doc(docId).set({
          adId,
          userId,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      queryClient.setQueryData(
        ["if_ad_is_added_to_favorites", adId],
        !isAlreadyAdded
      );

      await queryClient.invalidateQueries({ queryKey: ["user-favorites"] });

      Toast.hide();
      showToast(
        "success",
        isAlreadyAdded
          ? "Annonce supprimée des favoris !"
          : "Annonce ajoutée aux favoris !"
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'annonce dans les favoris",
        error
      );
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
    }
  };

  return { ifAdIsAddedToFavorites, addAdFavorites };
};
