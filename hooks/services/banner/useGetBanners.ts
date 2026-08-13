import { BannerType } from "@/types";
import { firebaseFunctions } from "@/utils/firebase";

export const useGetBanners = () => {
  const getBanners = async () => {
    try {
      const getBannersCallable = firebaseFunctions.httpsCallable<
        void,
        BannerType[]
      >("getBanners");

      const response = await getBannersCallable();

      const data = response.data.map((banner, id) => ({
        ...banner,
        id: (id + 1).toString(),
      }));

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des bannières :", error);
      throw error;
    }
  };

  return { getBanners };
};
