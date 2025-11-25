import Announcements from "@/components/annoucement/Announcements";
import NoAds from "@/components/annoucement/NoAds";
import Container from "@/components/Container";
import AppFullScreenLoader from "@/components/custom/AppFullScreenLoader";
import MerchantInfoSection from "@/components/Merchand/MerchantInfoSection";
import PageHeader from "@/components/PageHeader";
import ProfileContentHead from "@/components/profile/ProfileContentHead";
import { useGetAdsByUserId } from "@/hooks/services/ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "@/hooks/services/ads/useGetUserAdsCount";
import { useGetUserById } from "@/hooks/services/user/useGetUserById";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";

export default function MerchantProfile() {
  const { designSystem } = useAppTheme();

  const { userId } = useLocalSearchParams();

  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();

  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["user-data", userId, "merchant"],
    queryFn: () => getUserById(userId as string),
  });

  const {
    data: ads,
    isLoading: adsIsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-ads", userId],
    queryFn: ({ pageParam }) =>
      getAdsByUserId(
        userId as string,
        "ACTIVATED",
        pageParam as FirebaseFirestoreTypes.QueryDocumentSnapshot | null,
      ),
    initialPageParam: null as any,

    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastDoc : undefined;
    },
  });

  const { data: adsCount, isLoading: adsCountIsLoading } = useQuery({
    queryKey: ["user-ads-count", userId, "merchant"],
    queryFn: () => getUserAdsCount(userId as string),
  });

  const allAds = useMemo(() => {
    if (!ads?.pages) return [];
    return ads.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [ads]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = userIsLoading || adsCountIsLoading || adsIsLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["user-data", userId, "merchant"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-ads", userId],
    });
    setRefreshing(false);
  }, [queryClient, userId]);

  return (
    <>
      <Container withBottom style={styles.container} withGoBack>
        <PageHeader name="Profile" style={{ paddingHorizontal: 20 }} />

        {isLoading && <AppFullScreenLoader />}

        {!isLoading && (
          <Announcements
            values={allAds}
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
                {/* info section */}
                <MerchantInfoSection
                  data={user!}
                  adsCount={adsCount as number}
                />
              </>
            }
            onEndReached={handleLoadMore}
            isLoadingMore={isFetchingNextPage}
          />
        )}

        {!isLoading && !user && allAds.length === 0 && !adsCount && (
          <NoAds
            style={{ paddingTop: "70%" }}
            text="Aucune annonce disponible."
          />
        )}
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  stickyTab: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 20,
  },
  container: {},
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
});
