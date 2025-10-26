import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import HomeGoBackMoadal from "@/components/home/HomeGoBackMoadal";
import HomeHeaderSection from "@/components/home/HomeHeaderSection";
import PostAnAdButton from "@/components/PostAnAdButton";
import AnnouncementCardSkeleton from "@/components/skeleton/AnnouncementCardSkeleton";
import { HStack } from "@/components/ui/hstack";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useScrollStore } from "@/store/useScrollStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import HeaderTexture1 from "../../assets/images/textures/HeaderTexture1.png";

export default function Home() {
  const { designSystem } = useAppTheme();
  const { getHomeAds } = useGetHomeAds();
  const scrollY = new Animated.Value(0);
  const [goBackIsModalOpen, setGoBackIsModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  useBackPress(() => {
    setGoBackIsModalOpen(true);
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["home-ads"],
      queryFn: (context) => getHomeAds({ pageParam: context.pageParam }),
      initialPageParam: null as any,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.lastDoc : undefined;
      },
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const allAds = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["home-ads"] });
    setRefreshing(false);
  }, [queryClient]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasAds = allAds && allAds.length > 0;
  const initialLoading = isLoading && !hasAds;

  const flatListRef = useRef<FlatList>(null);
  const { homeScrollOffset, setHomeScrollOffset } = useScrollStore();
  const hasRestoredScroll = useRef(false);
  const currentScrollOffset = useRef(0);

  useEffect(() => {
    if (
      flatListRef.current &&
      homeScrollOffset > 0 &&
      !hasRestoredScroll.current
    ) {
      flatListRef.current.scrollToOffset({
        offset: homeScrollOffset,
        animated: false,
      });
      hasRestoredScroll.current = true;
    }
  }, [homeScrollOffset]);

  useEffect(() => {
    return () => {
      if (currentScrollOffset.current > 0) {
        setHomeScrollOffset(currentScrollOffset.current);
      }
    };
  }, [setHomeScrollOffset]);

  const handleScroll = useCallback((e: any) => {
    currentScrollOffset.current = e.nativeEvent.contentOffset.y;
  }, []);

  return (
    <>
      {/* go back modal */}
      <HomeGoBackMoadal
        goBackIsModalOpen={goBackIsModalOpen}
        setGoBackIsModalOpen={setGoBackIsModalOpen}
        onSubmit={() => {
          setGoBackIsModalOpen(false);
          BackHandler.exitApp();
        }}
      />

      {/* content */}
      <Container style={styles.container} withBottom={false}>
        {/* button ajouter une annonce */}
        <PostAnAdButton />

        {/* header */}
        <HeaderHideAnimation scrollY={scrollY} headerHeight={350}>
          <Image style={styles.headerTexture1} source={HeaderTexture1} />
          <HomeHeaderSection />
        </HeaderHideAnimation>

        {/* main */}
        <View style={styles.main}>
          {/* Loader initial */}
          {initialLoading && (
            <HStack
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 20,
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginTop: 295,
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
              ref={flatListRef}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[designSystem.colors.primary]}
                  tintColor={designSystem.colors.primary}
                  progressViewOffset={290}
                />
              }
              values={allAds}
              scrollY={scrollY}
              style={{ paddingBottom: 60, paddingTop: 293 }}
              onEndReached={handleLoadMore}
              isLoadingMore={isFetchingNextPage}
              onScroll={handleScroll}
            />
          )}

          {/* Message "aucune annonce" */}
          {!initialLoading && !hasAds && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "60%",
                paddingHorizontal: 20,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <AppText
                style={{ textAlign: "center", color: "#555", fontSize: 16 }}
              >
                Aucune annonce disponible pour le moment. Veuillez réessayer
                plus tard ou ajuster vos filtres.
              </AppText>
            </View>
          )}
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTexture1: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  main: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopStartRadius: 10,
  },
});
