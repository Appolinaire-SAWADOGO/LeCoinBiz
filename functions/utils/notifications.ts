import { admin, db } from "../firebase";

export async function sendUserNotification({
  title,
  body,
  userId,
  extraData = {},
}: {
  title: string;
  body: string;
  userId: string;
  extraData?: Record<string, any>;
}) {
  const docId = db.collection("Notifications").doc().id;

  await db
    .collection("Notifications")
    .doc(docId)
    .set({
      title,
      body,
      type: "USER_NOTIFICATION",
      userId,
      ...extraData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  await admin.messaging().send({
    topic: `user_${userId}`,
    notification: { title, body },
  });
}

export async function sendAdminNotification({
  title,
  body,
  extraData = {},
}: {
  title: string;
  body: string;
  extraData?: Record<string, any>;
}) {
  const docId = db.collection("Notifications").doc().id;

  await db
    .collection("Notifications")
    .doc(docId)
    .set({
      title,
      body,
      type: "ADMIN_NOTIFICATION",
      ...extraData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  await admin.messaging().send({
    topic: `admin`,
    notification: { title, body },
  });
}
