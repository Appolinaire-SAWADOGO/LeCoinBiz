import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationType } from "@/types";
import { firebaseFunctions } from "@/utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useGetNotifications = () => {
  const { setHasNotifications } = useNotificationStore();

  const getNotifications = async () => {
    try {
      const getNotificationsFn =
        firebaseFunctions.httpsCallable("getNotifications");
      const rlst = (await getNotificationsFn()) as any;
      const notifications = rlst.data.notifications as NotificationType[];

      const storageNotifications = await AsyncStorage.getItem("notifications");

      if (
        (notifications && !storageNotifications) ||
        (notifications &&
          storageNotifications &&
          JSON.stringify(notifications.map((notif) => notif.id)) !==
            storageNotifications)
      ) {
        await AsyncStorage.setItem(
          "notifications",
          JSON.stringify(notifications.map((notif) => notif.id)),
        );

        setHasNotifications(true);

        return notifications;
      }

      return notifications;
    } catch (error) {
      console.error(
        "Erreur récupération des notifications [getNotifications]:",
        error,
      );
      throw error;
    }
  };

  return { getNotifications };
};
