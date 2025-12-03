import Announcements from "@/components/announcement/Announcements";
import NoAds from "@/components/announcement/NoAds";
import Container from "@/components/Container";
import AppFullScreenLoader from "@/components/custom/AppFullScreenLoader";
import MerchantInfoSection from "@/components/Merchand/MerchantInfoSection";
import ProfileContentHead from "@/components/profile/ProfileContentHead";
import ProfilePageTitleSection from "@/components/profile/ProfilePageTitleSection";
import { useGetAdsByUserId } from "@/hooks/services/ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "@/hooks/services/ads/useGetUserAdsCount";
import { useGetUserById } from "@/hooks/services/user/useGetUserById";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, UserType } from "@/types";
import { getAuth } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";

export default function Profile() {
  const { designSystem } = useAppTheme();

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const { getAdsByUserId } = useGetAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();

  const [contentHeadSelected, setContentHeadSelected] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const { data: userData, isLoading: userIsLoading } = useQuery({
    queryKey: ["user-data", userId, "profile"],
    queryFn: () => getUserById(userId as string),
  });

  // user activated ads count
  const { data: activatedAdsCount, isLoading: activatedAdsCountIsLoading } =
    useQuery({
      queryKey: ["user-activated-ads-count"],
      queryFn: () => getUserAdsCount(userId as string, "ACTIVATED"),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
      refetchOnMount: true, // Refetch au montage si données stale
      retry: 2, // Nombre de tentatives en cas d'erreur
    });

  // user desabled ads count
  const { data: desabledAdsCount, isLoading: desabledAdsCountIsLoading } =
    useQuery({
      queryKey: ["user-disabled-ads-count"],
      queryFn: () => getUserAdsCount(userId as string, "DISABLED"),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
      refetchOnMount: true, // Refetch au montage si données stale
      retry: 2, // Nombre de tentatives en cas d'erreur
    });

  // user pending ads count
  const { data: pendingAdsCount, isLoading: pendingAdsCountIsLoading } =
    useQuery({
      queryKey: ["user-pending-ads-count"],
      queryFn: () => getUserAdsCount(userId as string, "PENDING"),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
      refetchOnMount: true, // Refetch au montage si données stale
      retry: 2, // Nombre de tentatives en cas d'erreur
    });

  // activated ads
  const {
    data: activatedAdsData,
    isLoading: activatedAdsIsLoading,
    fetchNextPage: fetchNextPageActivated,
    hasNextPage: hasNextPageActivated,
    isFetchingNextPage: isFetchingNextPageActivated,
  } = useInfiniteQuery({
    queryKey: ["user-activated-ads"],
    queryFn: ({ pageParam }) =>
      getAdsByUserId(
        userId as string,
        "ACTIVATED",
        pageParam as FirebaseFirestoreTypes.QueryDocumentSnapshot | null
      ),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastDoc : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes

    refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
    refetchOnMount: true, // Refetch au montage si données stale
    retry: 2, // Nombre de tentatives en cas d'erreur
  });

  // disabled ads
  const {
    data: disabledAdsData,
    isLoading: disabledAdsIsLoading,
    fetchNextPage: fetchNextPageDisabled,
    hasNextPage: hasNextPageDisabled,
    isFetchingNextPage: isFetchingNextPageDisabled,
  } = useInfiniteQuery({
    queryKey: ["user-disabled-ads"],
    queryFn: ({ pageParam }) =>
      getAdsByUserId(
        userId as string,
        "DISABLED",
        pageParam as FirebaseFirestoreTypes.QueryDocumentSnapshot | null
      ),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastDoc : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes

    refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
    refetchOnMount: true, // Refetch au montage si données stale
    retry: 2, // Nombre de tentatives en cas d'erreur
  });

  // pending ads
  const {
    data: pendingAdsData,
    isLoading: pendingAdsIsLoading,
    fetchNextPage: fetchNextPagePending,
    hasNextPage: hasNextPagePending,
    isFetchingNextPage: isFetchingNextPagePending,
  } = useInfiniteQuery({
    queryKey: ["user-pending-ads"],
    queryFn: ({ pageParam }) =>
      getAdsByUserId(
        userId as string,
        "PENDING",
        pageParam as FirebaseFirestoreTypes.QueryDocumentSnapshot | null
      ),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastDoc : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes

    refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
    refetchOnMount: true, // Refetch au montage si données stale
    retry: 2, // Nombre de tentatives en cas d'erreur
  });

  const allActivatedAds = useMemo(() => {
    if (!activatedAdsData?.pages) return [];
    return activatedAdsData.pages
      .flatMap((page) => page?.ads || [])
      .filter(Boolean);
  }, [activatedAdsData]);

  const allDesabledAds = useMemo(() => {
    if (!disabledAdsData?.pages) return [];
    return disabledAdsData.pages
      .flatMap((page) => page?.ads || [])
      .filter(Boolean);
  }, [disabledAdsData]);

  const allPendingAds = useMemo(() => {
    if (!pendingAdsData?.pages) return [];
    return pendingAdsData.pages
      .flatMap((page) => page?.ads || [])
      .filter(Boolean);
  }, [pendingAdsData]);

  const ActivatedAdsHandleLoadMore = useCallback(() => {
    if (hasNextPageActivated && !isFetchingNextPageActivated) {
      fetchNextPageActivated();
    }
  }, [
    hasNextPageActivated,
    isFetchingNextPageActivated,
    fetchNextPageActivated,
  ]);

  const DesabledAdsHandleLoadMore = useCallback(() => {
    if (hasNextPageDisabled && !isFetchingNextPageDisabled) {
      fetchNextPageDisabled();
    }
  }, [hasNextPageDisabled, isFetchingNextPageDisabled, fetchNextPageDisabled]);

  const PendingAdsHandleLoadMore = useCallback(() => {
    if (hasNextPagePending && !isFetchingNextPagePending) {
      fetchNextPagePending();
    }
  }, [hasNextPagePending, isFetchingNextPagePending, fetchNextPagePending]);

  const adsCountIsLoading =
    activatedAdsCountIsLoading ||
    desabledAdsCountIsLoading ||
    pendingAdsCountIsLoading;

  const adsIsLoading =
    activatedAdsIsLoading || disabledAdsIsLoading || pendingAdsIsLoading;

  const isLoading = userIsLoading || adsCountIsLoading || adsIsLoading;

  const ads = useMemo(() => {
    if (contentHeadSelected === 0) return allActivatedAds;
    if (contentHeadSelected === 1) return allDesabledAds;
    if (contentHeadSelected === 2) return allPendingAds;
    return [];
  }, [contentHeadSelected, allActivatedAds, allDesabledAds, allPendingAds]);

  const handleLoadMore = useCallback(() => {
    if (contentHeadSelected === 0) ActivatedAdsHandleLoadMore();
    if (contentHeadSelected === 1) DesabledAdsHandleLoadMore();
    if (contentHeadSelected === 2) PendingAdsHandleLoadMore();
  }, [
    contentHeadSelected,
    ActivatedAdsHandleLoadMore,
    DesabledAdsHandleLoadMore,
    PendingAdsHandleLoadMore,
  ]);

  const isFetchingNextPage = useMemo(() => {
    if (contentHeadSelected === 0) return isFetchingNextPageActivated;
    if (contentHeadSelected === 1) return isFetchingNextPageDisabled;
    if (contentHeadSelected === 2) return isFetchingNextPagePending;

    return false;
  }, [
    contentHeadSelected,
    isFetchingNextPageActivated,
    isFetchingNextPageDisabled,
    isFetchingNextPagePending,
  ]);

  const selectedAds = useMemo(() => {
    if (contentHeadSelected === 0) return allActivatedAds;
    if (contentHeadSelected === 1) return allDesabledAds;
    if (contentHeadSelected === 2) return allPendingAds;
    return [];
  }, [contentHeadSelected, allActivatedAds, allDesabledAds, allPendingAds]);

  const selectedAdsCount = useMemo(() => {
    if (contentHeadSelected === 0) return activatedAdsCount;
    if (contentHeadSelected === 1) return desabledAdsCount;
    if (contentHeadSelected === 2) return pendingAdsCount;
    return 0;
  }, [
    activatedAdsCount,
    contentHeadSelected,
    desabledAdsCount,
    pendingAdsCount,
  ]);

  const selectedAdsIsLoading = useMemo(() => {
    if (contentHeadSelected === 0) return activatedAdsIsLoading;
    if (contentHeadSelected === 1) return disabledAdsIsLoading;
    if (contentHeadSelected === 2) return pendingAdsIsLoading;
    return false;
  }, [
    activatedAdsIsLoading,
    contentHeadSelected,
    disabledAdsIsLoading,
    pendingAdsIsLoading,
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["user-data", userId, "profile"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-activated-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-disabled-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-pending-ads-count"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-activated-ads"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-disabled-ads"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-pending-ads"],
    });
    setRefreshing(false);
  }, [queryClient, userId]);

  const adsStatus: AdStatusType = useMemo(() => {
    if (contentHeadSelected === 0) return "ACTIVATED";
    if (contentHeadSelected === 1) return "DISABLED";
    if (contentHeadSelected === 2) return "PENDING";

    return "ACTIVATED";
  }, [contentHeadSelected]);

  return (
    <Container withBottom={false} style={styles.container}>
      {isLoading && <AppFullScreenLoader />}

      {!isLoading && (
        <Announcements
          values={ads}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[designSystem.colors.primary]}
              tintColor={designSystem.colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              <ProfilePageTitleSection user={userData as UserType} />

              {/* info section */}
              <MerchantInfoSection
                data={userData as UserType}
                adsCount={
                  (activatedAdsCount! +
                    desabledAdsCount! +
                    pendingAdsCount!) as number
                }
              />
              {/* profile content head */}
              <ProfileContentHead
                useCase={"profile"}
                contentHeadSelected={contentHeadSelected}
                setContentHeadSelected={setContentHeadSelected}
                activatedAdsCount={activatedAdsCount as number}
                desabledAdsCount={desabledAdsCount as number}
                pendingAdsCount={pendingAdsCount as number}
              />
            </>
          }
          announcementCardUseCase="ProfilePage"
          onEndReached={handleLoadMore}
          isLoadingMore={isFetchingNextPage}
        />
      )}

      {!selectedAdsIsLoading &&
        selectedAds.length === 0 &&
        !selectedAdsCount && (
          <NoAds
            style={{ paddingTop: "70%" }}
            text="Aucune annonce disponible."
          />
        )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {},
});
