import { ResetFormType } from "@/types";
import {
  addAdToInfiniteList,
  incrementCount,
  showToast,
  Timestamp,
} from "@/utils";
import { firebasyeFunctions } from "@/utils/firebase";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { useQueryClient } from "@tanstack/react-query";
import "react-native-get-random-values";
import { z } from "zod";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";
import { useUploadImgs } from "./useUploadImgs";

type FormData = z.infer<typeof PostAnAddSchema>;

export const usePostAnAd = () => {
  const queryClient = useQueryClient();
  const { uploadImgs, uploadVideo } = useUploadImgs();
  const currentUser = useCurrentUser();

  const postAnAdd = async (
    data: FormData,
    resetForm: ResetFormType,
    onSuccess?: () => void,
  ) => {
    if (!currentUser) {
      showToast("error", "Connectez-vous pour publier une annonce.");
      return null;
    }

    if (!currentUser.displayName) {
      showToast(
        "error",
        "Ajouter un nom d'utilisateur pour publier une annonce.",
      );
      return null;
    }

    if (!data) return null;

    const uploadResult = await uploadImgs(data.images);

    if (!uploadResult || uploadResult.length === 0) {
      return null;
    }

    // ← NOUVEAU : upload vidéo si présente
    let videoUrl: string | undefined = undefined;

    if (data.video) {
      const uploaded = await uploadVideo(data.video);
      if (!uploaded) return null;
      videoUrl = uploaded;
    }

    try {
      const postAnAdCallable = firebasyeFunctions.httpsCallable<
        {
          data: FormData;
        },
        { docId: string; createdAt: Timestamp; updatedAt: Timestamp }
      >("postAnAd");

      const response = await postAnAdCallable({
        data: {
          ...data,
          images: uploadResult,
          video: videoUrl, // ← NOUVEAU
        },
      });

      incrementCount(
        ["user-activated-ads-count", currentUser.uid],
        queryClient,
      );
      addAdToInfiniteList(
        ["user-activated-ads", currentUser.uid],
        {
          ...data,
          id: response.data.docId,
          userId: currentUser.uid,
          images: uploadResult,
          status: "ACTIVATED",
          stats: {
            views: 0,
            clicks: 0,
            favorites: 0,
          },
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        },
        queryClient,
      );

      resetForm();

      onSuccess?.();

      showToast("success", "Annonce ajoutée.");

      return response.data.docId;
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'annonce via Cloud Function :",
        error,
      );
      showToast(
        "error",
        "Une erreur est survenue. Vérifiez votre connexion ou réessayez.",
      );
      return null;
    }
  };

  return { postAnAdd };
};
