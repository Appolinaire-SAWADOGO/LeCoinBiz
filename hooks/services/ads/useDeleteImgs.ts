import { showToast } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import Toast from "react-native-toast-message";

export const useDeleteImgs = () => {
  const deleteImgs = async (imgs: string[]) => {
    if (!imgs || imgs.length === 0) return null;

    try {
      const deleteImgsFn = firebaseFunctions.httpsCallable("deleteImgs");
      await deleteImgsFn({ imgs });
    } catch (error) {
      console.error("Erreur suppression images :", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.", 0);
    }
  };

  return { deleteImgs };
};
