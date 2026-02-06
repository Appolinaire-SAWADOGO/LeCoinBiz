import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { QueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";

export const getDeviceToken = async () => {
  if (!Device.isDevice) {
    console.log(
      "L'utilisation d'un appareil physique est obligatoire pour les notifications push.",
    );
    return null;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission not granted for notifications");
      return null;
    }

    const token = await messaging().getToken();
    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du jeton de l'appareil :",
      error,
    );
    return null;
  }
};

export const registerUserToken = async (userId: string) => {
  try {
    const token = await getDeviceToken();

    if (!token) return;

    const docId = uuidv4();

    await firestore().collection("UserFcmTokens").doc(docId).set({
      token: token,
      userId: userId,
      platform: Platform.OS,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log("Jeton utilisateur enregistré :", userId);
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement du jeton utilisateur :",
      error,
    );
  }
};

export const unregisterUserToken = async (userId: string) => {
  try {
    const userFcmToken = await firestore()
      .collection("UserFcmTokens")
      .where("userId", "==", userId)
      .get();

    userFcmToken.docs.every(async (doc) => await doc.ref.delete());

    console.log("User token unregistered:", userId);
  } catch (error) {
    console.error("Error unregistering user token:", error);
  }
};

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
