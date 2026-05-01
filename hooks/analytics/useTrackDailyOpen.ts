import { firebaseFunctions } from "@/utils/firebase";
import * as Application from "expo-application";
import { Platform } from "react-native";

export const useTrackDailyOpen = () => {
  const trackDailyOpen = async () => {
    console.log("hello from trackDailyOpen --------------");

    try {
      // ID unique par appareil, sans besoin d'auth
      const deviceId =
        Platform.OS === "android"
          ? Application.getAndroidId()
          : await Application.getIosIdForVendorAsync();

      console.log(
        "deviceId envoyé: ++++++++++++++++++++++++++++++++++++++++++++",
        deviceId,
      ); // ← vérifie que c'est bien une string

      if (!deviceId) return;

      const callable = firebaseFunctions.httpsCallable("trackDailyOpen");
      await callable({ deviceId });
    } catch (error) {
      console.error("Erreur lors du tracking d'ouverture :", error);
    }
  };

  return { trackDailyOpen };
};
