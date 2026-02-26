import { SetFilterType } from "@/store/useFilterStatesStore";
import { AnnouncementType } from "@/types";
import { firebasyeFunctions } from "@/utils/firebase";

export const useGetFilterAds = () => {
  const getFilterAds = async ({
    pageParam = 0,
    filtersStatesStore,
  }: {
    pageParam?: number;
    filtersStatesStore: SetFilterType;
  }): Promise<{
    ads: AnnouncementType[];
    lastDoc: number;
    hasMore: boolean;
    totalHits: number;
  }> => {
    try {
      const getFilterAdsFn = firebasyeFunctions.httpsCallable<
        {
          page: number;
          filtersStatesStore: SetFilterType;
        },
        {
          ads: AnnouncementType[];
          lastDoc: number;
          hasMore: boolean;
          totalHits: number;
        }
      >("getFilterAds");

      const result = await getFilterAdsFn({
        page: pageParam,
        filtersStatesStore,
      });

      return result.data;
    } catch (error) {
      console.error("getFilterAds error:", error);
      return { ads: [], lastDoc: 0, hasMore: false, totalHits: 0 };
    }
  };

  return { getFilterAds };
};
