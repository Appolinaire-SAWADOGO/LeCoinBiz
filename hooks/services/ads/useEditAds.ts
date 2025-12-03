import { AdStatusType, AnnouncementType } from "@/types";
import { showToast } from "@/utils";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import "react-native-get-random-values";
import { z } from "zod";
import { useUploadAdImgs } from "./useUploadAdImgs";

type FormData = z.infer<typeof PostAnAddSchema>;

export const useEditAd = () => {
  const queryClient = useQueryClient();
  const { uploadAdImgs } = useUploadAdImgs();

  const editAd = async (
    data: FormData,
    preData: AnnouncementType,
    adStatus: AdStatusType,
    adId: string,
    from: "NORMAL" | "AD_DETAILS"
  ) => {
    if (!data) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      showToast("error", "Connectez-vous pour modifier une annonce.");
      return null;
    }

    try {
      // Identifier les images locales et en ligne en gardant leur position
      const imageProcessingMap = data.images.map((img, index) => ({
        originalImage: img,
        index,
        isLocal:
          img.startsWith("file://") ||
          (!img.startsWith("http://") && !img.startsWith("https://")),
      }));

      // Extraire uniquement les images locales à uploader
      const localImages = imageProcessingMap
        .filter((item) => item.isLocal)
        .map((item) => item.originalImage);

      // Upload les images locales si nécessaire
      let uploadedUrls: string[] = [];
      if (localImages.length > 0) {
        const uploadResult = await uploadAdImgs(localImages);
        if (!uploadResult) {
          showToast(
            "error",
            "Échec du téléchargement des images. Vérifiez votre connexion."
          );
          return null;
        }
        uploadedUrls = uploadResult;
      }

      // Reconstruire le tableau d'images dans le bon ordre
      let uploadedIndex = 0;
      const finalImages = imageProcessingMap.map((item) => {
        if (item.isLocal) {
          // Remplacer l'image locale par son URL uploadée
          return uploadedUrls[uploadedIndex++];
        } else {
          // Garder l'URL en ligne existante
          return item.originalImage;
        }
      });

      // Comparer les données et ne mettre à jour que ce qui a changé
      const updates: any = {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Vérifier chaque champ individuellement
      if (data.title !== preData.title) {
        updates.title = data.title;
      }
      if (data.description !== preData.description) {
        updates.description = data.description;
      }
      if (data.price !== preData.price) {
        updates.price = data.price;
      }
      if (data.category !== preData.category) {
        updates.category = data.category;
      }
      if (data.subCategory !== preData.subCategory) {
        updates.subCategory = data.subCategory;
      }
      if (data.city !== preData.city) {
        updates.city = data.city;
      }
      if (data.phoneNumber !== preData.phoneNumber) {
        updates.phoneNumber = data.phoneNumber;
      }
      if (data.whatsappNumber !== preData.whatsappNumber) {
        updates.whatsappNumber = data.whatsappNumber;
      }

      // Comparer les tableaux
      if (
        JSON.stringify(data.conditions) !== JSON.stringify(preData.conditions)
      ) {
        updates.conditions = data.conditions;
      }
      if (JSON.stringify(data.options) !== JSON.stringify(preData.options)) {
        updates.options = data.options;
      }
      if (JSON.stringify(finalImages) !== JSON.stringify(preData.images)) {
        updates.images = finalImages;
      }

      // Si des modifications ont été détectées (au-delà de updatedAt)
      if (Object.keys(updates).length > 1) {
        updates.status = "PENDING";

        await firestore().collection("Ads").doc(adId).update(updates);

        // Invalider les queries appropriées
        if (adStatus === "ACTIVATED") {
          await queryClient.invalidateQueries({
            queryKey: ["user-activated-ads-count"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["user-activated-ads"],
          });
        } else if (adStatus === "DISABLED") {
          await queryClient.invalidateQueries({
            queryKey: ["user-disabled-ads-count"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["user-disabled-ads"],
          });
        }

        await queryClient.invalidateQueries({
          queryKey: ["user-pending-ads-count"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["user-pending-ads"],
        });

        if (from === "AD_DETAILS") {
          await queryClient.invalidateQueries({
            queryKey: ["ad", adId],
          });
        }

        showToast(
          "success",
          "Votre annonce a été modifiée avec succès et est en attente de validation"
        );

        if (from === "AD_DETAILS") router.back();
      } else {
        showToast("error", "Aucune modification détectée");
        return null;
      }
    } catch (error) {
      showToast(
        "error",
        "Échec de la modification de l'annonce. Vérifiez votre connexion ou réessayez."
      );
      console.error("Erreur lors de la modification de l'annonce :", error);
      return null;
    }
  };

  return { editAd };
};
