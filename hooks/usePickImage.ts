import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import * as FileSystem from "expo-file-system";
import ImageCropPicker from "react-native-image-crop-picker";

export const usePickImage = () => {
  const { open, close } = usePickerImageAlertModalStore();

  const pickImage = async (
    callBack: (img: string) => void,
    maxSizeInMB = 2,
  ) => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: "photo",
        cropping: true,
        freeStyleCropEnabled: true,
        cropperToolbarColor: "#000000",
        cropperStatusBarColor: "#000000",
        cropperToolbarWidgetColor: "#ffffff",
      });

      const uri = image.path;

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
          `L'image sélectionnée est trop volumineuse. La taille maximale autorisée est de ${maxSizeInMB} MB. Votre fichier fait ${sizeInMB.toFixed(2)} MB.`,
        );
        return null;
      }

      close();
      callBack(uri);
    } catch (e: any) {
      // L'utilisateur a annulé — on ne montre pas d'erreur
      if (e?.code === "E_PICKER_CANCELLED") return null;

      // Permission refusée
      if (e?.code === "E_NO_LIBRARY_PERMISSION") {
        open("Permission requise pour accéder à vos photos.");
        return null;
      }

      open("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return { pickImage };
};
