import { filterNotificationsQueryData, showToast } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { unsubscribeFromUserTopic } from "@/utils/notifications";
import { getAuth } from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export const useDeleteAccount = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();

  const deleteAccount = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      showToast("error", "Aucun utilisateur connecté.");
      return null;
    }

    const userId = currentUser.uid;
    setIsLoading(true);

    try {
      showToast("loading", "Suppression en cours.");

      await unsubscribeFromUserTopic(userId);
      filterNotificationsQueryData(queryClient, userId);

      const deleteAccountCallable = firebaseFunctions.httpsCallable<
        { userId: string },
        { message: "success" }
      >("deleteAccount");

      await deleteAccountCallable({ userId });

      await auth.signOut();

      showToast("success", "Compte supprimé avec succès.");
    } catch (error: any) {
      console.error(
        "Erreur lors de la suppression du compte via Cloud Function :",
        error,
      );

      if (error.code === "auth/requires-recent-login") {
        showToast(
          "error",
          "Cette action nécessite une connexion récente. Veuillez vous déconnecter puis vous reconnecter.",
        );
      } else {
        showToast("error", "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAccount, isLoading };
};
