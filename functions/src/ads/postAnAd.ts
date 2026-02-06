import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

type FirebaseProviderId = "password" | "phone" | "google.com";

export const postAnAdd = onCall(
  { consumeAppCheckToken: false },
  async (request) => {
    try {
      const auth = request.auth;
      const { data } = request.data;

      if (!auth) {
        throw new HttpsError(
          "unauthenticated",
          "Connectez-vous pour publier une annonce.",
        );
      }

      const { uid, token } = auth;

      const authMethodMap: Record<
        FirebaseProviderId,
        "EMAIL_PASSWORD" | "PHONE_NUMBER" | "GOOGLE"
      > = {
        password: "EMAIL_PASSWORD",
        phone: "PHONE_NUMBER",
        "google.com": "GOOGLE",
      };

      const provider = token.firebase.sign_in_provider as FirebaseProviderId;

      const currentUser = {
        uid,
        displayName: token.name,
        emailVerified: token.email_verified,
        authMethod: authMethodMap[provider],
      };

      if (
        currentUser.authMethod === "EMAIL_PASSWORD" &&
        !currentUser.emailVerified
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Vérifiez votre email pour publier une annonce.",
        );
      }

      if (!currentUser.displayName) {
        throw new HttpsError(
          "failed-precondition",
          "Ajoutez un nom d'utilisateur.",
        );
      }

      if (!data) {
        throw new HttpsError(
          "invalid-argument",
          "Aucune donnée reçue pour l'annonce. Veuillez remplir tous les champs requis.",
        );
      }

      if (!Array.isArray(data.images) || data.images.length === 0) {
        throw new HttpsError(
          "invalid-argument",
          "Aucune image fournie pour l'annonce.",
        );
      }

      const docId = uuidv4();
      const now = Timestamp.now();

      await db
        .collection("Ads")
        .doc(docId)
        .set({
          ...data,
          userId: currentUser.uid,
          status: "PENDING",
          stats: {
            views: 0,
            clicks: 0,
            favorites: 0,
          },
          createdAt: now,
          updatedAt: now,
        });

      const title = "🆕 Nouvelle annonce publiée";
      const body =
        "📌 Une nouvelle annonce vient d’être publiée sur la plateforme.";

      await admin.messaging().send({
        topic: "admin",
        notification: {
          title,
          body,
        },
      });

      return {
        docId,
        createdAt: {
          _seconds: now.seconds,
          _nanoseconds: now.nanoseconds,
        },
        updatedAt: {
          _seconds: now.seconds,
          _nanoseconds: now.nanoseconds,
        },
      };
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'annonce :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
