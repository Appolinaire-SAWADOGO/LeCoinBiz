import { AnnouncementType } from "@/types";
import { firebasyeFunctions } from "@/utils/firebase";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

type PageParam = { path: string } | null | undefined;

type GetFavoritesResult = {
  ads: AnnouncementType[];
  lastDoc: PageParam;
  hasMore: boolean;
};

export const useGetFavoriteAdsByUserId = () => {
  const currentUser = useCurrentUser();
  const userId = currentUser?.uid;

  const getFavoritesAdsByUserId = async (pageParam: PageParam) => {
    console.log("pageParam :", pageParam);

    if (!userId) {
      return { ads: [], lastDoc: null, hasMore: false };
    }

    try {
      const getFavoritesCallable = firebasyeFunctions.httpsCallable<
        { pageParam?: PageParam },
        GetFavoritesResult
      >("getFavoriteAdsByUserId");

      const response = await getFavoritesCallable({ pageParam });
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des favoris de l'utilisateur :",
        error,
      );
      return { ads: [], lastDoc: null, hasMore: false };
    }
  };

  return { getFavoritesAdsByUserId };
};
