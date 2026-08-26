import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

const MAX_SIZE_MB = 50;
const MAX_DURATION_SEC = 30;

export const usePickVideo = () => {
  const { open } = usePickerImageAlertModalStore();

  const pickVideo = async (callBack: (uri: string) => void) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setTimeout(() => {
          open("Permission requise pour accéder à vos vidéos.");
        }, 500);
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true,
        videoMaxDuration: MAX_DURATION_SEC,
        quality: 1,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const uri = asset.uri;

      // Vérif durée
      if (asset.duration && asset.duration > MAX_DURATION_SEC * 1000) {
        setTimeout(() => {
          open(
            `La vidéo est trop longue. La durée maximale est de ${MAX_DURATION_SEC} secondes.`,
          );
        }, 500);
        return null;
      }

      // Vérif taille
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists || !fileInfo.size) {
        open("Impossible de vérifier la vidéo. Veuillez réessayer.");
        return null;
      }

      const sizeInMB = fileInfo.size / (1024 * 1024);
      if (sizeInMB > MAX_SIZE_MB) {
        setTimeout(() => {
          open(
            `La vidéo est trop volumineuse. Maximum ${MAX_SIZE_MB} MB. Votre fichier fait ${sizeInMB.toFixed(0)} MB.`,
          );
        }, 500);
        return null;
      }

      callBack(uri);
    } catch (e: any) {
      if (e?.code === "E_PICKER_CANCELLED") return null;
      open("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return { pickVideo };
};
