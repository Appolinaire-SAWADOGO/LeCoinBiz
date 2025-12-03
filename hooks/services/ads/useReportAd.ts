import { showToast } from "@/utils";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";

export const useReportAd = () => {
  const currentUser = auth().currentUser;

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
      const existingReportQuery = await firestore()
        .collection("Reports")
        .where("userId", "==", currentUser.uid)
        .where("adId", "==", adId)
        .limit(1)
        .get();

      if (!existingReportQuery.empty) {
        const existingReportDoc = existingReportQuery.docs[0];

        await firestore()
          .collection("Reports")
          .doc(existingReportDoc.id)
          .update({
            count: firestore.FieldValue.increment(1),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

        Toast.hide();
        showToast("success", "Votre signalement a été mis à jour.");
      } else {
        const docId = uuidv4();

        await firestore().collection("Reports").doc(docId).set({
          userId: currentUser.uid,
          adId,
          count: 1,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        Toast.hide();
        showToast("success", "Annonce signalée avec succès.");
      }
    } catch (error) {
      Toast.hide();
      showToast(
        "error",
        "Échec du signalement de l'annonce. Vérifiez votre connexion ou réessayez."
      );
      console.error("Erreur lors du signalement de l'annonce :", error);
      return null;
    }
  };

  return { reportAd };
};
