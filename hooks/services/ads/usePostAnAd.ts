import { showToast } from "@/functions";
import { ResetFormType } from "@/types";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

type FormData = z.infer<typeof PostAnAddSchema>;

export const usePostAnAd = () => {
  const queryClient = useQueryClient();

  const postAnAdd = async (data: FormData, resetForm: ResetFormType) => {
    if (!data) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      showToast("error", "Connectez-vous pour publier une annonce.");
      return null;
    }

    const uploadUrl = [] as string[];

    for (const localUri of data.images) {
      try {
        const formData = new FormData();

        const extension = localUri.split(".").pop();
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
        uploadUrl.push(json.secure_url);
      } catch (error) {
        console.log(
          "Error l'ors du telechagement de l'image. Vérifiez votre connexion ou réessayez.",
          error
        );
        showToast(
          "error",
          "Error l'ors du telechagement de l'image. Vérifiez votre connexion ou réessayez."
        );
        return null;
      }
    }

    if (uploadUrl.length === 0) {
      showToast(
        "error",
        "Échec de l’ajout de l’annonce. Vérifiez votre connexion ou réessayez."
      );
      return null;
    }

    try {
      const docId = uuidv4();

      await firestore()
        .collection("Ads")
        .doc(docId)
        .set({
          ...data,
          userId: currentUser.uid,
          images: uploadUrl,
          status: "PENDING",
          stats: {
            views: 0,
            clicks: 0,
            favorites: 0,
          },
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      await queryClient.invalidateQueries({
        queryKey: ["user-ads", currentUser.uid, "profile"],
      });

      showToast("success", "Votre annonce a été ajoutée avec succès !");
      return docId;
    } catch (error) {
      showToast(
        "error",
        "Échec de l’ajout de l’annonce. Vérifiez votre connexion ou réessayez."
      );
      console.error("Erreur lors de l'ajout de l'annonce :", error);
      return null;
    }
  };

  return { postAnAdd };
};
