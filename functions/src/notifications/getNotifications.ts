import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../../firebase";

export const getNotifications = onCall(
  { consumeAppCheckToken: false, region: "europe-southwest1" },
  async (request) => {
    try {
      const userId = request.auth?.uid;
      const isAdmin = request.data?.isAdmin === true;

      let notifications: any[] = [];

      if (!isAdmin) {
        const generalNotificationsSnapshot = await db
          .collection("Notifications")
          .where("type", "==", "GENERAL_NOTIFICATION")
          .orderBy("createdAt", "desc")
          .limit(5)
          .get();

        const generalNotifications = generalNotificationsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

        let userNotifications: any[] = [];

        if (userId) {
          const userNotificationsSnapshot = await db
            .collection("Notifications")
            .where("type", "==", "USER_NOTIFICATION")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

          userNotifications = userNotificationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        notifications = [...generalNotifications, ...userNotifications].sort(
          (a: any, b: any) => {
            const timeA = a.createdAt?.toMillis?.() ?? 0;
            const timeB = b.createdAt?.toMillis?.() ?? 0;
            return timeB - timeA;
          },
        );
      } else {
        const adminNotificationsSnapshot = await db
          .collection("Notifications")
          .where("type", "==", "ADMIN_NOTIFICATION")
          .orderBy("createdAt", "desc")
          .limit(20)
          .get();

        notifications = adminNotificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return { notifications };
    } catch (error: any) {
      console.error("Erreur getNotifications :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
