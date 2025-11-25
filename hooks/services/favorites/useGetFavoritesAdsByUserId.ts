import { AnnouncementType } from "@/types";
import { getAuth } from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

const PAGE_SIZE = 10;

type PageParam =
  | FirebaseFirestoreTypes.QueryDocumentSnapshot
  | null
  | undefined;

export const useGetFavoriteAdsByUserId = () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const getFavoritesAdsByUserId = async (pageParam: PageParam) => {
    try {
      if (!userId) return { favoritesAds: [], lastDoc: null, hasMore: false };

      let favoritesQuery = firestore()
        .collection("Favorites")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (pageParam) {
        favoritesQuery = favoritesQuery.startAfter(pageParam);
      }

      const favoritesSnap = await favoritesQuery.get();

      if (favoritesSnap.empty) {
        return { favoritesAds: [], lastDoc: null, hasMore: false };
      }

      const favoritesAdsId = favoritesSnap.docs.map(
        (doc) => doc.data().adId
      ) as string[];

      const adsPromises = favoritesAdsId.map(async (adId) => {
        const adDoc = await firestore().collection("Ads").doc(adId).get();
        if (!!adDoc.exists) {
          return { id: adDoc.id, ...adDoc.data() } as AnnouncementType;
        }
        return null;
      });

      const adsResults = await Promise.all(adsPromises);
      const favoritesAds = adsResults.filter(
        (ad): ad is AnnouncementType => ad !== null
      );

      const lastDoc = favoritesSnap.docs[favoritesSnap.docs.length - 1] || null;
      const hasMore = favoritesSnap.docs.length === PAGE_SIZE;

      return {
        favoritesAds,
        lastDoc,
        hasMore,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des favoris de l'utilisateur :",
        error
      );
      return { favoritesAds: [], lastDoc: null, hasMore: false };
    }
  };

  return { getFavoritesAdsByUserId };
};
