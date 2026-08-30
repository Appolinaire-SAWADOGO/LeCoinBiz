import Announcements from "@/components/announcement/Announcements";
import NoData from "@/components/announcement/NoData";
import VerticalScollAnnoucements from "@/components/announcement/VerticalScollAnnoucements";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import HomeGoBackMoadal from "@/components/home/HomeGoBackMoadal";
import HomeHeaderSection from "@/components/home/HomeHeaderSection";
import PostAnAdButton from "@/components/PostAnAdButton";
import SectionHeaderText from "@/components/SectionHeaderText";
import { useGetBoostAds } from "@/hooks/services/ads/useGetBoostAds";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Animated,
  BackHandler,
  Image,
  LayoutChangeEvent,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import HeaderTexture1 from "../../assets/images/textures/HeaderTexture1.png";

export default function Home() {
  const { designSystem } = useAppTheme();
  const { getHomeAds } = useGetHomeAds();
  const { getBoostAds } = useGetBoostAds();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [goBackIsModalOpen, setGoBackIsModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(350);

  const { setOptions } = useFilterStatesStore();

  const userId = useCurrentUser()?.uid;

  useBackPress(() => {
    setGoBackIsModalOpen(true);
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["home-ads"],
    queryFn: (context) => getHomeAds({ pageParam: context.pageParam }),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined;
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: Infinity, // cache conservé

    refetchOnMount: true, // refetch si stale
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // recommandé pour app mobile

    retry: 2,
  });

  const {
    data: boostAdsData,
    isLoading: isBoostAdsLoading,
    isFetching: isBoostAdsFetching,
  } = useQuery({
    queryKey: ["home-boost-ads"],
    queryFn: () => getBoostAds(),

    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: Infinity, // cache conservé

    refetchOnMount: true, // refetch si stale
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // recommandé pour app mobile

    retry: 2,
  });

  const allAds = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["home-ads"] });
    await queryClient.invalidateQueries({ queryKey: ["home-boost-ads"] });
    await queryClient.invalidateQueries({ queryKey: ["home-banners"] });
    await queryClient.invalidateQueries({
      queryKey: ["notifications", userId],
    });
    setRefreshing(false);
  }, [queryClient]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height > 0) setHeaderHeight(Math.round(height));
  }, []);

  const headerHiddenValue = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const handlePress = async () => {
    setOptions([
      { label: "Annonces Populaire", active: false },
      { label: "Livraison Gratuite", active: false },
      { label: "Neuf", active: false },
      { label: "A la une", active: true },
    ]);

    router.navigate(`/(root)/Filters`);
    await queryClient.invalidateQueries({
      queryKey: ["filter-ads"],
    });
  };

  const hasAds = allAds && allAds.length > 0;
  // const hasBoostAds = boostAdsData && boostAdsData.length > 0;
  const initialLoading = isLoading && !hasAds;
  const isOnlyFetching = isFetching && !isFetchingNextPage;

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
      <View style={styles.container}>
        {/* button ajouter une annonce */}
        <PostAnAdButton />

        {/* header animation */}
        <HeaderHideAnimation
          scrollY={scrollY}
          headerHeight={headerHeight}
          style={{ zIndex: headerHiddenValue }}
        >
          <Image style={styles.headerTexture1} source={HeaderTexture1} />
          <HomeHeaderSection withBanner={false} />
        </HeaderHideAnimation>

        {/* main */}
        <View style={styles.main}>
          {/* Liste d'annonces */}
          <Announcements
            ListHeaderComponent={
              <>
                {/* header */}
                <View
                  style={{ marginHorizontal: -20 }}
                  onLayout={onHeaderLayout}
                >
                  <Image
                    style={styles.headerTexture1}
                    source={HeaderTexture1}
                  />
                  <HomeHeaderSection />
                </View>

                {/* Annonces boostées */}
                {boostAdsData && boostAdsData.length > 0 && (
                  <View>
                    <View style={styles.sectionTitle}>
                      <SectionHeaderText
                        withViewAll
                        name="À la une"
                        style={{ marginBottom: 0 }}
                        onPress={handlePress}
                      />
                    </View>

                    <VerticalScollAnnoucements
                      data={boostAdsData}
                      style={{ marginBottom: 15 }}
                      containerStyle={{ marginBottom: 0 }}
                      itemWrapperStyle={{ marginBottom: 0 }}
                    />
                  </View>
                )}

                <View style={styles.sectionTitle}>
                  <SectionHeaderText
                    withViewAll={false}
                    name="Annonces récentes"
                    style={{ marginBottom: 0 }}
                  />
                </View>
              </>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing || isOnlyFetching}
                onRefresh={onRefresh}
                colors={[designSystem.colors.primary]}
                tintColor={designSystem.colors.primary}
                progressViewOffset={headerHeight}
              />
            }
            values={allAds}
            scrollY={scrollY}
            style={{ paddingBottom: 60 }}
            onEndReached={handleLoadMore}
            isLoadingMore={isFetchingNextPage}
          />

          {/* Message "aucune annonce" */}
          {!initialLoading && !hasAds && (
            <NoData text="Aucune annonce disponible pour le moment. Veuillez réessayer plus tard." />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTexture1: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  main: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopStartRadius: 10,
  },
  sectionTitle: {
    backgroundColor: "#fff",
    paddingBottom: 5,
  },
});
