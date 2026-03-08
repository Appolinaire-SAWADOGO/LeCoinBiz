import { RESERVED_USERNAMES } from "@/constants";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { QueryClient } from "@tanstack/react-query";

export const getCurrentUserAuthMethod = (
  currentUser: FirebaseAuthTypes.User | null,
) => {
  return currentUser?.providerData?.[0]?.providerId;
};

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPassword = (value: string) => {
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);
  const hasMinLength = value.length >= 8;
  const hasMaxLength = value.length <= 20;

  const ifPasswordValided =
    hasLetter && hasNumber && hasSpecial && hasMinLength && hasMaxLength;

  return {
    ifPasswordValided,
    hasLetter,
    hasNumber,
    hasSpecial,
    hasMinLength,
    hasMaxLength,
  };
};

export const initialPrefetchQuery = async (
  queryClient: QueryClient,
  getFavoritesAdsByUserId: any,
  getUserById: any,
  getUserAdsCount: any,
  getAdsByUserId: any,
  getNotifications: any,
  userId?: string,
) => {
  try {
    await queryClient.prefetchQuery({
      queryKey: ["notifications", userId],
      queryFn: () => getNotifications(),
    });

    if (!userId) return;

    await queryClient.prefetchInfiniteQuery({
      queryKey: ["user-favorites", userId],
      queryFn: ({ pageParam }) => getFavoritesAdsByUserId(pageParam),
      initialPageParam: null as any,
      getNextPageParam: (lastPage) => {
        return lastPage?.hasMore ? lastPage.lastDoc : undefined;
      },
      pages: 1,
    }),
      await queryClient.prefetchQuery({
        queryKey: ["user", userId, "profile"],
        queryFn: () => getUserById(userId),
      }),
      await queryClient.prefetchQuery({
        queryKey: ["user-activated-ads-count", userId],
        queryFn: () => getUserAdsCount(userId, "ACTIVATED"),
      }),
      await queryClient.prefetchQuery({
        queryKey: ["user-disabled-ads-count", userId],
        queryFn: () => getUserAdsCount(userId, "DISABLED"),
      }),
      await queryClient.prefetchQuery({
        queryKey: ["user-pending-ads-count", userId],
        queryFn: () => getUserAdsCount(userId, "PENDING"),
      }),
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["user-activated-ads", userId],
        queryFn: ({ pageParam }) =>
          getAdsByUserId(userId, "ACTIVATED", pageParam),
        initialPageParam: null as any,
        getNextPageParam: (lastPage) => {
          return lastPage?.hasMore ? lastPage.lastCreatedAt : undefined;
        },
        pages: 1,
      }),
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["user-disabled-ads", userId],
        queryFn: ({ pageParam }) =>
          getAdsByUserId(userId, "DISABLED", pageParam),
        initialPageParam: null as any,
        getNextPageParam: (lastPage) => {
          return lastPage?.hasMore ? lastPage.lastCreatedAt : undefined;
        },
        pages: 1,
      }),
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["user-pending-ads", userId],
        queryFn: ({ pageParam }) =>
          getAdsByUserId(userId, "PENDING", pageParam),
        initialPageParam: null as any,
        getNextPageParam: (lastPage) => {
          return lastPage?.hasMore ? lastPage.lastCreatedAt : undefined;
        },
        pages: 1,
      }),
      console.log(
        "Toutes les données ont été préchargées avec succès userId : ",
        userId,
      );
  } catch (error) {
    console.error("Erreur lors du préchargement des données:", error);
  }
};

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}
