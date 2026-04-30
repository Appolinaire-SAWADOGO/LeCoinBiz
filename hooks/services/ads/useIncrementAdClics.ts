import { firebaseFunctions } from "@/utils/firebase";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useIncrementAdClics = () => {
  const userId = useCurrentUser()?.uid;

  const incrementAdClics = async (
    adId: string,
    adUserId: string,
    from: "OtherPage" | "ProfilePage",
  ) => {
    if (!adId || !adUserId || !from || from === "ProfilePage") return null;

    if (userId && userId === adUserId) return null;

    try {
      const incrementAdClicsFunction =
        firebaseFunctions.httpsCallable("incrementAdClics");
      await incrementAdClicsFunction({ adId, from });
    } catch (error) {
      console.error("Erreur l'ors de l'incrementation de l'annonce :", error);
    }
  };

  return { incrementAdClics };
};
