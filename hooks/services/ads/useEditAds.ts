import { AdStatusType, AnnouncementType } from "@/types";
import { modifyAdToInfiniteList, showToast } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";
import { useUploadImgs } from "./useUploadImgs";

type FormData = z.infer<typeof PostAnAddSchema>;

export const useEditAd = () => {
  const queryClient = useQueryClient();
  const { uploadImgs, uploadVideo } = useUploadImgs();

  const editAd = async (
    data: FormData,
    preData: AnnouncementType,
    adStatus: AdStatusType,
    adId: string,
    from: "NORMAL" | "AD_DETAILS",
  ) => {
    if (!data || !adId) return null;

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

      // Gestion de la vidéo
      let finalVideo = data.video;
      const isVideoLocal =
        data.video &&
        (data.video.startsWith("file://") ||
          (!data.video.startsWith("http://") &&
            !data.video.startsWith("https://")));

      if (isVideoLocal && data.video) {
        const uploadedVideo = await uploadVideo(data.video);
        if (uploadedVideo) {
          finalVideo = uploadedVideo;
        } else {
          throw new Error("Erreur lors de l'upload de la vidéo.");
        }
      }

      const deletedVideo =
        preData.video && data.video !== preData.video ? preData.video : null;

      const updates: any = {};

      if (data.title !== preData.title) updates.title = data.title;
      if (data.description !== preData.description)
        updates.description = data.description;
      if (data.price !== preData.price) updates.price = data.price;
      if (data.city !== preData.city) updates.city = data.city;
      if (JSON.stringify(data.address) !== JSON.stringify(preData.address))
        updates.address = data.address;
      if (data.phoneNumber !== preData.phoneNumber)
        updates.phoneNumber = data.phoneNumber;
      if (data.whatsappNumber !== preData.whatsappNumber)
        updates.whatsappNumber = data.whatsappNumber;

      if (JSON.stringify(data.options) !== JSON.stringify(preData.options)) {
        updates.options = data.options;
      }

      if (JSON.stringify(finalImages) !== JSON.stringify(preData.images)) {
        updates.images = finalImages;
      }

      if (finalVideo !== preData.video) {
        updates.video = finalVideo;
      }

      if (!Object.keys(updates).length) {
        showToast("error", "Aucune modification détectée.");
        return null;
      }

      const editAdFn = firebaseFunctions.httpsCallable("editAd");
      await editAdFn({
        adId,
        updates,
        deletedImages,
        deletedVideo,
      });

      // console.log(preData.title, data.title);

      if (adStatus === "ACTIVATED") {
        modifyAdToInfiniteList(
          ["user-activated-ads", preData.userId],
          { ...data, id: preData.id },
          queryClient,
        );
      } else if (adStatus === "DISABLED") {
        modifyAdToInfiniteList(
          ["user-disabled-ads", preData.userId],
          { ...data, id: preData.id },
          queryClient,
        );
      } else if (adStatus === "PENDING") {
        modifyAdToInfiniteList(
          ["user-pending-ads", preData.userId],
          { ...data, id: preData.id },
          queryClient,
        );
      }

      showToast("success", "Annonce modifiée.");

      router.back();

      if (from === "AD_DETAILS") router.back();
    } catch (error) {
      console.error("editAd error:", error);
      showToast("error", "Une erreur est survenue.");
    }
  };

  return { editAd };
};
