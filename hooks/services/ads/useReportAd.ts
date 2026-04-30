import { showToast } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import Toast from "react-native-toast-message";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useReportAd = () => {
  const currentUser = useCurrentUser();

  const reportAd = async (adId: string, adUserId: string) => {
    if (!currentUser) {
      showToast("error", "Vous devez être connecté pour signaler une annonce.");
      return null;
    }

    if (adUserId === currentUser.uid) {
      showToast("error", "Vous ne pouvez pas signaler votre propre annonce.");
      return null;
    }

    showToast("loading", "Traitement en cours.");

    try {
      const reportAdCallable = firebaseFunctions.httpsCallable<
        { userId: string; adId: string; adUserId: string },
        { message: "already_exists" | "created" }
      >("reportAd");

      const response = await reportAdCallable({
        userId: currentUser.uid,
        adId,
        adUserId,
      });

      Toast.hide();

      if (response.data.message === "already_exists") {
        showToast("error", "Vous avez déjà signalé cette annonce.");
      } else {
        showToast("success", "Annonce signalée avec succès.");
      }

      return response.data.message;
    } catch (error) {
      Toast.hide();
      showToast(
        "error",
        "Échec du signalement de l'annonce. Vérifiez votre connexion ou réessayez.",
      );
      console.error(
        "Erreur lors du signalement de l'annonce via Cloud Function :",
        error,
      );
      return null;
    }
  };

  return { reportAd };
};
