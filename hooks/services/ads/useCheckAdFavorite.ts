import { firebaseFunctions } from "@/utils/firebase";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useCheckAdFavorite = () => {
  const userId = useCurrentUser()?.uid;

  const ifAdIsAddedToFavorites = async (adId: string) => {
    if (!userId) return false;

    if (!adId) return false;

    try {
      const checkFavoriteFunction = firebaseFunctions.httpsCallable(
        "ifAdIsAddedToFavorites",
      );
      const result = await checkFavoriteFunction({ adId });

      const { added } = result.data as { added: boolean };
      return added;
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris :", error);
      return false;
    }
  };

  return { ifAdIsAddedToFavorites };
};
