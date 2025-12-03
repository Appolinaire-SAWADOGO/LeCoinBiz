import { showToast } from "@/utils";
import axios from "axios";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const useUploadAdImgs = () => {
  const uploadAdImgs = async (images: string[]): Promise<string[] | null> => {
    const cloudinaryUrl = process.env.EXPO_PUBLIC_CLOUDINARY_URL;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudinaryUrl || !uploadPreset) {
      console.error("Variables d'environnement Cloudinary manquantes");
      showToast("error", "Configuration incorrecte. Contactez le support.");
      return null;
    }

    if (images.length === 0) {
      return [];
    }

    const uploadUrl = [] as string[];

    for (const localUri of images) {
      try {
        const formData = new FormData();

        const extension = localUri.split(".").pop();
        const mimeType = `image/${extension}`;

        formData.append("file", {
          uri: localUri,
          type: mimeType,
          name: `photo_${uuidv4()}.${extension}`,
        } as any);
        formData.append("upload_preset", uploadPreset as string);
        formData.append("folder", "lecoinbiz");

        const res = await axios.post(cloudinaryUrl as string, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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

    return uploadUrl;
  };

  return {
    uploadAdImgs,
  };
};
