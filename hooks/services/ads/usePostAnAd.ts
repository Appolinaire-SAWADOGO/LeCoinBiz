import { showToast } from "@/functions";
import { ResetFormType } from "@/types";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import axios from "axios";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

type FormData = z.infer<typeof PostAnAddSchema>;

export const usePostAnAd = () => {
  const postAnAdd = async (data: FormData, resetForm: ResetFormType) => {
    if (!data) return;

    // 1. Vérifie si l'utilisateur est authentifié
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error("Vous devez être connecté pour publier une annonce.");
    }

    const uploadUrl = [] as string[];

    // 2. Envoie les images vers Cloudinary
    for (const localUri of data.images) {
      try {
        const formData = new FormData();

        const extension = localUri.split(".").pop(); // "jpg" ou "png"
        const mimeType = `image/${extension}`;

        formData.append("file", {
          uri: localUri,
          type: mimeType,
          name: `photo_${uuidv4()}.${extension}`,
        } as any);
        formData.append(
          "upload_preset",
          process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
        );
        formData.append("folder", "lecoinbiz");

        const res = await axios.post(
          process.env.EXPO_PUBLIC_CLOUDINARY_URL as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const json = await res.data;
        uploadUrl.push(json.secure_url); // L’URL privée de l’image json.secure_url; // L’URL publique de l’image
      } catch (error) {
        console.log("Error l'ors du telechagement de l'image:", error);
      }
    }

    if (uploadUrl.length === 0) {
      throw new Error("Aucune image ajoutée.");
    }

    // uploader l'annonce sur firestore
    try {
      // 3. Crée un id unique pour l'annonce
      const docId = uuidv4();

      // 4. Ajoute l'annonce dans Firestore avec les URLs des images et userId
      await firestore()
        .collection("Ads")
        .doc(docId)
        .set({
          ...data,
          userId: currentUser.uid, // ajoute le userId
          images: uploadUrl, // remplace les chemins locaux par les URLs
          status: "PENDING",
          stats: {
            views: 0,
            clicks: 0,
            favorites: 0,
          },
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      showToast("success", "Votre annonce a été ajoutée avec succès !");
      console.log("Annonce ajoutée avec succès !");
      return docId;
    } catch (error) {
      showToast(
        "error",
        "Échec de l’ajout de l’annonce. Vérifiez votre connexion ou réessayez."
      );
      console.error("Erreur lors de l'ajout de l'annonce :", error);
      throw error;
    }
  };

  return { postAnAdd };
};
