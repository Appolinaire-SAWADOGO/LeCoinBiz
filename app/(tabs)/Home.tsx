import Announcements from "@/components/announcement/Announcements";
import NoData from "@/components/announcement/NoData";
import Container from "@/components/Container";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import HomeGoBackMoadal from "@/components/home/HomeGoBackMoadal";
import HomeHeaderSection from "@/components/home/HomeHeaderSection";
import PostAnAdButton from "@/components/PostAnAdButton";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import {
  Animated,
  BackHandler,
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

  const userId = useCurrentUser()?.uid;

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

      staleTime: Infinity, // ✅ Les données ne deviennent JAMAIS stale
      gcTime: Infinity, // ✅ Les données ne sont JAMAIS supprimées du cache

      refetchOnWindowFocus: false, // ✅ Pas de refetch au focus
      refetchOnMount: false, // ✅ Pas de refetch au montage
      refetchOnReconnect: false, // ✅ Pas de refetch lors de la reconnexion
      retry: 2,
    });

  const allAds = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["home-ads"] });
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

  const hasAds = allAds && allAds.length > 0;
  const initialLoading = isLoading && !hasAds;

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
          {/* Liste d'annonces */}
          <Announcements
            refreshControl={
              <RefreshControl
                refreshing={refreshing || initialLoading}
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
          />

          {/* Message "aucune annonce" */}
          {!initialLoading && !hasAds && (
            <NoData text="Aucune annonce disponible pour le moment. Veuillez réessayer plus tard." />
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
