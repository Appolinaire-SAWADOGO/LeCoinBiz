import { ResetFormType } from "@/types";
import { showToast } from "@/utils";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useUploadAdImgs } from "./useUploadAdImgs";

type FormData = z.infer<typeof PostAnAddSchema>;

export const usePostAnAd = () => {
  const queryClient = useQueryClient();
  const { uploadAdImgs } = useUploadAdImgs();

  const postAnAdd = async (data: FormData, resetForm: ResetFormType) => {
    if (!data) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      showToast("error", "Connectez-vous pour publier une annonce.");
      return null;
    }

    let uploadUrl = [] as string[];

    const uploadResult = await uploadAdImgs(data.images);

    if (!uploadResult) {
      showToast(
        "error",
        "Échec du téléchargement des images. Vérifiez votre connexion."
      );
      return null;
    } else {
      uploadUrl = uploadResult;
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
        queryKey: ["user-pending-ads-count"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["user-pending-ads"],
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
