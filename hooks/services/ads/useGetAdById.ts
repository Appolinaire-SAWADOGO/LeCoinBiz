import { AnnouncementType } from "@/types";
import { firebasyeFunctions } from "@/utils/firebase";

export const useGetAdById = () => {
  const getAdById = async (adId: string): Promise<AnnouncementType | null> => {
    try {
      const getAdFn = firebasyeFunctions.httpsCallable<
        { adId: string },
        { ad: AnnouncementType | null }
      >("getAdById");

      const result = await getAdFn({ adId });

      return result.data.ad;
    } catch (error) {
      console.error(
        "Erreur de recuperation d'annonce par id [getAdById] :",
        error,
      );
      return null;
    }
  };

  return { getAdById };
};
