import { AnnouncementType } from "@/types";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

const PAGE_SIZE = 10;

type PageParam =
  | FirebaseFirestoreTypes.QueryDocumentSnapshot
  | null
  | undefined;

export const useGetHomeAds = () => {
  const getHomeAds = async ({ pageParam }: { pageParam: PageParam }) => {
    try {
      let query = firestore()
        .collection("Ads")
        .where("status", "==", "ACTIVATED")
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (pageParam) {
        query = query.startAfter(pageParam);
      }

      const result = await query.get();
      const ads = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AnnouncementType[];

      const lastDoc = result.docs[result.docs.length - 1];
      const hasMore = result.docs.length === PAGE_SIZE;

      return { ads: ads, lastDoc, hasMore };
    } catch (error) {
      console.log("Erreur récupération annonces :", error);
      return { ads: [], lastDoc: null, hasMore: false };
    }
  };

  return { getHomeAds };
};
