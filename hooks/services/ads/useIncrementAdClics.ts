import functions from "@react-native-firebase/functions";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useIncrementAdClics = () => {
  const userId = useCurrentUser()?.uid;

  const incrementAdClics = async (
    adId: string,
    adUserId: string,
    from: "OtherPage" | "ProfilePage",
  ) => {
    if (!adId || !adUserId || !from || from === "ProfilePage") return;

    if (userId && userId === adUserId) return;

    try {
      const incrementAdClicsFunction =
        functions().httpsCallable("incrementAdClics");
      await incrementAdClicsFunction({ adId, from });
    } catch (error) {
      console.error("Erreur l'ors de l'incrementation de l'annonce :", error);
    }
  };

  return { incrementAdClics };
};
