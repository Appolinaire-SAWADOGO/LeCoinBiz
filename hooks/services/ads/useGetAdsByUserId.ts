import { AdStatusType, AnnouncementType } from "@/types";
import functions from "@react-native-firebase/functions";

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
      const getAdsFn = functions().httpsCallable<
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
