import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

export const usePickImage = () => {
  const { open, close } = usePickerImageAlertModalStore();

  const pickImage = async (
    callBack: (img: string) => void,
    maxSizeInMB = 2
  ) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      open("Permission requise pour accéder à vos photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists || !fileInfo.size) {
        open(
          "Impossible de vérifier la taille de l'image. Veuillez réessayer."
        );
        return;
      }

      const sizeInMB = fileInfo.size / (1024 * 1024);

      if (sizeInMB > maxSizeInMB) {
        open(
          `L'image sélectionnée est trop volumineuse. La taille maximale autorisée est de ${maxSizeInMB} MB. Votre fichier fait ${sizeInMB.toFixed(
            2
          )} MB.`
        );
        return;
      }

      close();

      callBack(uri);
    }
  };

  return { pickImage };
};
