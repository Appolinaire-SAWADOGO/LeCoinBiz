import Announcements from "@/components/announcement/Announcements";
import NoAds from "@/components/announcement/NoAds";
import Container from "@/components/Container";
import MerchantInfoSection from "@/components/Merchand/MerchantInfoSection";
import PageHeader from "@/components/PageHeader";
import { useGetAdsByUserId } from "@/hooks/services/ads/useGetAdsByUserId";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";

export default function MerchantProfile() {
  const { designSystem } = useAppTheme();

  const { userRslt, userAdsCountRslt } = useLocalSearchParams();

  const user = JSON.parse(userRslt as string) as UserType;
  const userAdsCount = Number(userAdsCountRslt) as Number;

  const { getAdsByUserId } = useGetAdsByUserId();

  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: ads,
    isLoading: adsIsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["merchant-ads", user.id],
    queryFn: ({ pageParam }) =>
      getAdsByUserId(
        user.id as string,
        "ACTIVATED",
        pageParam as FirebaseFirestoreTypes.QueryDocumentSnapshot | null
      ),
    initialPageParam: null as any,

    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.lastDoc : undefined;
    },
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["merchant-ads", user.id],
    });
    setRefreshing(false);
  }, [queryClient, user.id]);

  const isLoading = adsIsLoading;

  console.log(JSON.stringify(user, null, 2));

  return (
    <>
      <Container withBottom style={styles.container} withGoBack>
        <PageHeader name="Profile" style={{ paddingHorizontal: 20 }} />

        <Announcements
          values={allAds}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={onRefresh}
              colors={[designSystem.colors.primary]}
              tintColor={designSystem.colors.primary}
              progressViewOffset={155}
            />
          }
          ListHeaderComponent={
            <>
              {/* info section */}
              <MerchantInfoSection
                data={user!}
                adsCount={userAdsCount as number}
              />
            </>
          }
          onEndReached={handleLoadMore}
          isLoadingMore={isFetchingNextPage}
        />

        {!isLoading && !allAds && (
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
