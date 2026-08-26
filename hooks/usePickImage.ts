import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import * as FileSystem from "expo-file-system/legacy";
import ImageCropPicker from "react-native-image-crop-picker";

export const usePickImage = () => {
  const { open, close } = usePickerImageAlertModalStore();

  const pickImage = async (
    callBack: (imgs: string[]) => void, // ← accepte maintenant un tableau
    maxSizeInMB = 2,
    maxFiles?: number,
  ) => {
    try {
      const isMultiple = !!maxFiles && maxFiles > 1;

      const result = await ImageCropPicker.openPicker({
        mediaType: "photo",
        cropping: !isMultiple, // le crop n'est généralement pas dispo en mode multiple
        freeStyleCropEnabled: true,
        cropperToolbarColor: "#000000",
        cropperStatusBarColor: "#000000",
        cropperToolbarWidgetColor: "#ffffff",
        multiple: isMultiple,
        maxFiles: isMultiple ? maxFiles : 1,
      });

      // Normalise : toujours travailler avec un tableau
      const images = Array.isArray(result) ? result : [result];

      const validUris: string[] = [];

      for (const img of images) {
        const uri = img.path;

        if (!uri) {
          open("Une image sélectionnée est invalide. Veuillez réessayer.");
          return null;
        }

        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists || !fileInfo.size) {
          open(
            "Impossible de vérifier la taille de l'image. Veuillez réessayer.",
          );
          return null;
        }

        const sizeInMB = fileInfo.size / (1024 * 1024);

        if (sizeInMB > maxSizeInMB) {
          open(
            `Une image sélectionnée est trop volumineuse. La taille maximale autorisée est de ${maxSizeInMB} MB. Ce fichier fait ${sizeInMB.toFixed(2)} MB.`,
          );
          return null;
        }

        validUris.push(uri);
      }

      close();
      callBack(validUris);
    } catch (e: any) {
      if (e?.code === "E_PICKER_CANCELLED") return null;

      if (e?.code === "E_NO_LIBRARY_PERMISSION") {
        open("Permission requise pour accéder à vos photos.");
        return null;
      }

      console.error(e);
      open("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return { pickImage };
};
