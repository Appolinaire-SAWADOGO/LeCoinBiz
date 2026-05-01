import { firebaseFunctions } from "@/utils/firebase";

export const useTrackContactInBackground = () => {
  const trackContactInBackground = (
    adId: string,
    contactType: "whatsapp" | "sms" | "call",
  ) => {
    if (!adId || !contactType) return null;

    try {
      const callabe = firebaseFunctions.httpsCallable("trackAdContact");

      callabe({
        adId,
        contactType,
      });
    } catch (error) {
      console.error("trackAdContact background error:", error);
    }
  };

  return { trackContactInBackground };
};
