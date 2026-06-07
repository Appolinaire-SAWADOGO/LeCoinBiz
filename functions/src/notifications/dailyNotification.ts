import { GoogleGenerativeAI } from "@google/generative-ai";
import { onRequest } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";
import { admin } from "../../firebase";

export const dailyNotification = onRequest(
  {
    region: "europe-southwest1",
    secrets: ["GEMINI_API_KEY"],
    invoker: "public", // Permet d'invoquer cette fonction sans authentification
  },
  async (req, res) => {
    try {
      // Récupérer quelques annonces récentes pour le contexte
      const snapshot = await admin
        .firestore()
        .collection("Ads")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      const annonces = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return `- ${data.title} (${data.category ?? "divers"})`;
        })
        .join("\n");

      // Demander à Gemini de générer le contenu de la notification
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent(`
        Tu es l'assistant d'une application d'annonces locales au Burkina Faso.
        Voici les dernières annonces publiées aujourd'hui :
        ${annonces}

        Génère une notification push engageante pour inciter les utilisateurs 
        à consulter l'application ce soir.
        Réponds UNIQUEMENT en JSON valide :
        {"title": "...", "body": "..."}
        - title : max 50 caractères
        - body : max 100 caractères
        - Ton : friendly, local, en français
      `);

      // Parser la réponse Gemini
      const clean = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const { title, body } = JSON.parse(clean);

      // Envoyer la notification via FCM + sauvegarder dans Firestore
      const docId = uuidv4();

      await admin.firestore().collection("Notifications").doc(docId).set({
        title,
        body,
        type: "GENERAL_NOTIFICATION",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await admin.messaging().send({
        topic: "general",
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            channelId: "default",
            priority: "high",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
          headers: {
            "apns-priority": "10",
          },
        },
      });

      console.log(`Notification envoyée : ${title} — ${body}`);
      res.status(200).json({ success: true, title, body });
    } catch (error: any) {
      console.error("Erreur dailyNotification :", error?.message);
      res.status(500).json({ success: false, error: error?.message });
    }
  },
);
