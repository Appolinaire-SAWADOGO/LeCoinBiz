import { AdStatusType, AnnouncementType } from "@/types";
import { firebaseFunctions } from "@/utils/firebase";

export type PageParam = { path: string } | null;

export type GetAdsByUserIdResult = {
  ads: AnnouncementType[];
  lastDoc: PageParam;
  hasMore: boolean;
};

export const useGetAdsByUserId = () => {
  const getAdsByUserId = async (
    userId: string,
    status: AdStatusType = "ACTIVATED",
    pageParam: PageParam,
  ): Promise<GetAdsByUserIdResult> => {
    try {
      const getAdsFn = firebaseFunctions.httpsCallable<
        { userId: string; status: AdStatusType; pageParam: PageParam },
        GetAdsByUserIdResult
      >("getAdsByUserId");

      const result = await getAdsFn({ userId, status, pageParam });

      return result.data;
    } catch (error) {
      console.error("getAdsByUserId error:", error);
      throw error;
    }
  };

  return { getAdsByUserId };
};
