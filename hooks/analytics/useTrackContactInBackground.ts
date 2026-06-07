import analytics from "@react-native-firebase/analytics";

export const useTrackContactInBackground = () => {
  const trackContactInBackground = async (
    adId: string,
    contactType: "whatsapp" | "sms" | "call",
  ) => {
    if (!adId || !contactType) return null;

    try {
      await analytics().logEvent("contact", {
        type: contactType,
      });
    } catch (error) {
      console.error("trackAdContact background error:", error);
    }
  };

  return { trackContactInBackground };
};
