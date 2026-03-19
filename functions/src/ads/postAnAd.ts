import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES_NAMES, SUB_CATEGORIES } from "../../constants/categories";
import { db } from "../../firebase";

type FirebaseProviderId = "password" | "phone" | "google.com";

export const postAnAd = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
    secrets: ["GEMINI_API_KEY"],
  },
  async (request) => {
    try {
      const auth = request.auth;
      const { data } = request.data;

      // console.log("Data : ", JSON.stringify(data));

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
        throw new HttpsError("invalid-argument", "Aucune donnée reçue.");
      }

      if (!Array.isArray(data.images) || data.images.length === 0) {
        throw new HttpsError("invalid-argument", "Aucune image fournie.");
      }

      // console.log("GEMINI_API_KEY présente ?", !!process.env.GEMINI_API_KEY);
      // console.log("Image URL reçue :", data.images?.[0]);

      // console.log("CATEGORIES_NAMES:", CATEGORIES_NAMES?.length);
      // console.log("SUB_CATEGORIES:", SUB_CATEGORIES?.length);

      let category = null;
      let subCategory = null;

      // console.log("apres Category et subCategory");

      try {
        // console.log("🔵 Avant detectCategory");

        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        // console.log("🔵 Import Gemini OK");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // console.log("🔵 GenAI créé");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        // console.log("🔵 Modèle créé");

        const result = await model.generateContent([
          {
            text: `Titre: "${data.title}".
Catégories: ${CATEGORIES_NAMES.join(", ")}.
Sous-catégories: ${SUB_CATEGORIES.map((s) => s.name).join(", ")}.
Réponds UNIQUEMENT en JSON: {"category": "nom_exact", "subCategory": "nom_exact"}`,
          },
        ]);

        // console.log("🔵 Résultat Gemini:", result.response.text());

        const clean = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        const detected = JSON.parse(clean);
        category = detected.category;
        subCategory = detected.subCategory;
      } catch (e: any) {
        console.error("🔴 Erreur complète:", e?.message, e?.stack);
      }

      // console.log("Catégorie détectée :", category);
      // console.log("Sous-catégorie détectée :", subCategory);

      const docId = uuidv4();
      const now = Timestamp.now();

      await db
        .collection("Ads")
        .doc(docId)
        .set({
          ...data,
          category,
          subCategory,
          userId: currentUser.uid,
          status: "ACTIVATED",
          stats: { views: 0, clicks: 0, favorites: 0 },
          createdAt: now,
          updatedAt: now,
        });

      // await admin.messaging().send({
      //   topic: "admin",
      //   notification: {
      //     title: "🆕 Nouvelle annonce publiée",a
      //     body: "📌 Une nouvelle annonce vient d'être publiée.",
      //   },
      // });

      return {
        docId,
        createdAt: { _seconds: now.seconds, _nanoseconds: now.nanoseconds },
        updatedAt: { _seconds: now.seconds, _nanoseconds: now.nanoseconds },
      };
    } catch (error: any) {
      console.error("Erreur :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);
