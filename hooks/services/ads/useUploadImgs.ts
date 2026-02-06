import { showToast } from "@/utils";
import storage from "@react-native-firebase/storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useUploadImgs = () => {
  const user = useCurrentUser();

  const uploadImgs = async (
    images: string[],
    type: "AdImages" | "ProfileImages" = "AdImages",
  ): Promise<string[] | null> => {
    if (images.length === 0) return [];

    if (!user) {
      showToast("error", "Utilisateur non connecté");
      return null;
    }

    const uploadedUrls: string[] = [];

    for (const localUri of images) {
      try {
        const extension = localUri.split(".").pop() || "jpg";
        const fileName = `ad_${uuidv4()}.${extension}`;

        const storageRef = storage().ref(`${type}/${user.uid}/${fileName}`);

        await storageRef.putFile(localUri);

        const downloadUrl = await storageRef.getDownloadURL();

        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.log("Erreur upload Firebase Storage:", error);
        return null;
      }
    }

    return uploadedUrls;
  };

  return {
    uploadImgs,
  };
};
