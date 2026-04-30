import { AdStatusType, AnnouncementType } from "@/types";
import { firebaseFunctions } from "@/utils/firebase";

export const useGetAdsByUserId = () => {
  const getAdsByUserId = async (
    userId: string,
    status: AdStatusType = "ACTIVATED",
    lastCreatedAt?: any,
  ): Promise<{
    ads: AnnouncementType[];
    lastCreatedAt: any;
    hasMore: boolean;
  }> => {
    try {
      const getAdsFn = firebaseFunctions.httpsCallable<
        {
          userId: string;
          status: AdStatusType;
          lastCreatedAt?: any;
        },
        {
          ads: AnnouncementType[];
          lastCreatedAt: any;
          hasMore: boolean;
        }
      >("getAdsByUserId");

      const result = await getAdsFn({
        userId,
        status,
        lastCreatedAt,
      });

      return result.data;
    } catch (error) {
      console.error("getAdsByUserId error:", error);
      return { ads: [], lastCreatedAt: null, hasMore: false };
    }
  };

  return { getAdsByUserId };
};
