import { AdStatusType, AnnouncementType } from "@/types";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

const PAGE_SIZE = 10;

type PageParam =
  | FirebaseFirestoreTypes.QueryDocumentSnapshot
  | null
  | undefined;

export const useGetAdsByUserId = () => {
  const getAdsByUserId = async (
    id: string,
    status: AdStatusType = "ACTIVATED",
    pageParam: PageParam
  ) => {
    try {
      if (!id) return { ads: [], lastDoc: null, hasMore: false };

      let adsSnap = firestore()
        .collection("Ads")
        .where("userId", "==", id)
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (pageParam) {
        adsSnap = adsSnap.startAfter(pageParam);
      }

      const result = await adsSnap.get();

      const adsData: AnnouncementType[] = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AnnouncementType[];

      const lastDoc = result.docs[result.docs.length - 1];
      const hasMore = result.docs.length === PAGE_SIZE;

      return {
        ads: adsData,
        lastDoc,
        hasMore,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la recupération des annonces de l'utilisateur :",
        error
      );
      return { ads: [], lastDoc: null, hasMore: false };
    }
  };

  return { getAdsByUserId };
};
