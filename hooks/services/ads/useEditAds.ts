import { AdStatusType, AnnouncementType } from "@/types";
import { addAdToInfiniteList, decrementCount, incrementCount, removeAdFromInfiniteList, showToast } from "@/utils";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import functions from "@react-native-firebase/functions";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";
import { useUploadImgs } from "./useUploadImgs";

type FormData = z.infer<typeof PostAnAddSchema>;

export const useEditAd = () => {
  const queryClient = useQueryClient();
  const { uploadImgs } = useUploadImgs();

  const editAd = async (
    data: FormData,
    preData: AnnouncementType,
    adStatus: AdStatusType,
    adId: string,
    from: "NORMAL" | "AD_DETAILS",
  ) => {
    if (!data || !adId) return;

    showToast("loading", "Traitement en cours.");

    try {
      // Identifier images locales
      const imageMap = data.images.map((img, index) => ({
        img,
        index,
        isLocal:
          img.startsWith("file://") ||
          (!img.startsWith("http://") && !img.startsWith("https://")),
      }));

      const localImages = imageMap.filter((i) => i.isLocal).map((i) => i.img);

      const deletedImages = preData.images.filter(
        (img) => !data.images.includes(img),
      );

      let uploadedUrls: string[] | null = [];
      if (localImages.length) {
        uploadedUrls = await uploadImgs(localImages);
      }

      let uploadIndex = 0;
      const finalImages = imageMap.map((item) =>
        item.isLocal ? uploadedUrls?.[uploadIndex++] : item.img,
      );

      const updates: any = {};

      if (data.title !== preData.title) updates.title = data.title;
      if (data.description !== preData.description)
        updates.description = data.description;
      if (data.price !== preData.price) updates.price = data.price;
      if (data.category !== preData.category) updates.category = data.category;
      if (data.subCategory !== preData.subCategory)
        updates.subCategory = data.subCategory;
      if (data.city !== preData.city) updates.city = data.city;
      if (data.phoneNumber !== preData.phoneNumber)
        updates.phoneNumber = data.phoneNumber;
      if (data.whatsappNumber !== preData.whatsappNumber)
        updates.whatsappNumber = data.whatsappNumber;

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

      if (!Object.keys(updates).length) {
        showToast("error", "Aucune modification détectée.");
        return;
      }

      const editAdFn = functions().httpsCallable("editAd");
      await editAdFn({
        adId,
        updates,
        deletedImages,
      });

      if (adStatus === "ACTIVATED") {
        removeAdFromInfiniteList(
          ["user-activated-ads", preData.userId],
          adId,
          queryClient
        );

        decrementCount(["user-activated-ads-count", preData.userId], queryClient);
      }

      else if (adStatus === "DISABLED") {
        removeAdFromInfiniteList(
          ["user-disabled-ads", preData.userId],
          adId,
          queryClient
        );

        decrementCount(["user-disabled-ads-count", preData.userId], queryClient);
      }

      if (adStatus !== "PENDING") {
        addAdToInfiniteList(
          ["user-pending-ads", preData.userId],
          {...preData, ...data , status: "PENDING"}, 
          queryClient
        );

        incrementCount(["user-pending-ads-count", preData.userId] , queryClient);

        removeAdFromInfiniteList(
          ["home-ads"],
          adId,
          queryClient
        );
      }

      showToast("success", "Annonce modifiée et envoyée pour validation.");

      router.back();

      if (from === "AD_DETAILS") router.back();
    } catch (error) {
      console.error("editAd error:", error);
      showToast("error", "Une erreur est survenue.");
    }
  };

  return { editAd };
};
