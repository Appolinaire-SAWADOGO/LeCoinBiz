import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import FiltersPageHeader from "@/components/fiters/FiltersPageHeader";
import AnnouncementCardSkeleton from "@/components/skeleton/AnnouncementCardSkeleton";
import { HStack } from "@/components/ui/hstack";
import { useGetFilterAds } from "@/hooks/services/ads/useGetFilterAds";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Animated, RefreshControl, StyleSheet, View } from "react-native";

export default function Filters() {
  const { category } = useLocalSearchParams();
  const decodedCategory = decodeURIComponent(category as string);

  const scrollY = new Animated.Value(0);

  const { designSystem } = useAppTheme();

  const { getFilterAds } = useGetFilterAds();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["filter-ads"],
      queryFn: (context) =>
        getFilterAds({
          pageParam: context.pageParam,
        }),
      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        return lastPage.hasMore && typeof lastPage.lastDoc === "number"
          ? lastPage.lastDoc + 1
          : undefined;
      },
    });

  const allAds = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["filter-ads"],
    });
    setRefreshing(false);
  }, [queryClient]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasAds = allAds && allAds.length > 0;
  const initialLoading = isLoading && !hasAds;

  useBackPress(() => router.back());

  return (
    <Container style={styles.container} withBottom>
      {/* header */}
      <FiltersPageHeader
        category={decodedCategory as string}
        scrollY={scrollY}
      />

      {/* Loader initial */}
      {initialLoading && (
        <HStack
          style={{
            paddingTop: 150,
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 20,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            rowGap: 16,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </HStack>
      )}

      {/* Liste d'annonces */}
      {hasAds && (
        <Announcements
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[designSystem.colors.primary]}
              tintColor={designSystem.colors.primary}
              progressViewOffset={130}
            />
          }
          values={allAds}
          scrollY={scrollY}
          style={{ paddingBottom: 60, paddingTop: 150 }}
          onEndReached={handleLoadMore}
          isLoadingMore={isFetchingNextPage}
        />
      )}

      {/* Message "aucune annonce" */}
      {!initialLoading && !hasAds && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "50%",
            paddingHorizontal: 20,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <AppText style={{ textAlign: "center", color: "#555", fontSize: 16 }}>
            Aucune annonce disponible pour le moment. Veuillez réessayer plus
            tard ou ajuster vos filtres.
          </AppText>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
  },
});
