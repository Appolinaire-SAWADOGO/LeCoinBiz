import messaging from "@react-native-firebase/messaging";
import { QueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const subscribeToGeneralTopic = async () => {
  try {
    await messaging().subscribeToTopic("general");

    console.log("Abonné au topic general.");
  } catch (error) {
    console.error("Erreur lors de l'abonnement au topic general:", error);
  }
};

export const subscribeToUserTopic = async (userId: string) => {
  try {
    await messaging().subscribeToTopic(`user_${userId}`);

    console.log("Abonné au topic d'utulisateur : ", userId);
  } catch (error) {
    console.error(
      "Erreur lors de l'abonnement au topic d'utulisateur : ",
      userId,
      error,
    );
  }
};

export const unsubscribeFromGeneralTopic = async () => {
  try {
    await messaging().unsubscribeFromTopic("general");

    console.log("Désabonné au topic general");
  } catch (error) {
    console.error("Erreur lors du désabonnement au topic general:", error);
  }
};

export const unsubscribeFromUserTopic = async (userId: string) => {
  try {
    await messaging().unsubscribeFromTopic(`user_${userId}`);

    console.log("Désabonné au topic d'utulisateur : ", userId);
  } catch (error) {
    console.error(
      "Erreur lors du désabonnement au topic d'utulisateur : ",
      userId,
      error,
    );
  }
};

// App en arrière-plan → notification cliquée
export function handleNotificationNavigation(
  queryClient: QueryClient,
  setIsAppNotificationClosed: (val: boolean) => void,
  setIsAppNotificationBackground: (val: boolean) => void,
  userId?: string,
) {
  // App fermée
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        setIsAppNotificationClosed(true);
        router.replace("/(root)/Notifications");
      }
    });

  // App en arrière-plan → notification cliquée
  messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage) {
      setIsAppNotificationBackground(true);
      router.replace("/(root)/Notifications");
    }
  });

  // // App ouverte → notification cliquée
  // Notifications.addNotificationResponseReceivedListener((response) => {
  //   if (response && response.notification) {
  //     // Vérifie que c'est bien une notification contenant un titre ou un body
  //     if (
  //       response &&
  //       response.notification &&
  //       (response.notification.request.content.title ||
  //         response.notification.request.content.body)
  //     ) {
  //       console.log(
  //         "Notification cliquée en foreground valide :",
  //         response.notification,
  //       );

  //       router.replace("/(root)/Notifications");
  //     } else {
  //       console.log("Notification ignorée car vide ou système :", response);
  //     }
  //   }
  // });
}
