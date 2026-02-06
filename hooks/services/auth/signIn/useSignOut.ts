import { filterNotificationsQueryData, showToast } from "@/utils";
import { unsubscribeFromUserTopic } from "@/utils/notifications";
import { getAuth } from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import Toast from "react-native-toast-message";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);

  const disconnect = async () => {
    const auth = getAuth();

    if (!auth) return;

    const userId = auth.currentUser?.uid;

    try {
      setIsLoading(true);

      showToast("loading", "Deconnexion en cours.");

      if (userId) {
        await unsubscribeFromUserTopic(userId);
        filterNotificationsQueryData(queryClient, userId);
      }

      await auth.signOut();

      Toast.hide();
      showToast("success", "Deconnexion reussie.");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue. veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return { disconnect, isLoading };
};
