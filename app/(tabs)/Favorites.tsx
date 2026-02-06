import Announcements from "@/components/announcement/Announcements";
import NoData from "@/components/announcement/NoData";
import Container from "@/components/Container";
import FavoriesHeaderSection from "@/components/favorites/FavoritesHeaderSection";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useGetFavoriteAdsByUserId } from "@/hooks/services/favorites/useGetFavoritesAdsByUserId";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { Animated, RefreshControl, StyleSheet } from "react-native";

export default function Favorites() {
  const [value, setValue] = React.useState<"annonces" | "utilisateurs">(
    "annonces",
  );
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = new Animated.Value(0);

  const { designSystem } = useAppTheme();

  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();

  const userId = useCurrentUser()?.uid;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["user-favorites", userId],
      queryFn: ({ pageParam }) => getFavoritesAdsByUserId(pageParam as any),
      initialPageParam: null as any,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.lastDoc : undefined;
      },

      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes

      refetchOnWindowFocus: false, // Ne pas refetch au focus de l'app
      refetchOnMount: true, // Refetch au montage si données stale
      retry: 2, // Nombre de tentatives en cas d'erreur
    });

  const allFavorites = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.ads || []).filter(Boolean);
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["user-favorites", userId],
    });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <Container withBottom={false} style={{ backgroundColor: "#fff" }}>
      <Announcements
        values={allFavorites}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            colors={[designSystem.colors.primary]}
            tintColor={designSystem.colors.primary}
            progressViewOffset={40}
          />
        }
        ListHeaderComponent={
          <FavoriesHeaderSection value={value} setValue={setValue} />
        }
        scrollY={scrollY}
        onEndReached={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />

      {!isLoading && allFavorites.length === 0 && (
        <>
          <NoData text="Aucune annonce en favoris." />
        </>
      )}

      {/* announce */}
      {/* {value === "annonces" && ( */}
      {/* <Announcements scrollY={scrollY} style={{ paddingTop: 95 }} /> */}
      {/* )} */}
      {/* {value === "utilisateurs" && (
        <Users
          scrollY={scrollY}
          style={{ paddingTop: 80, paddingBottom: 10 }}
        />
      )} */}
    </Container>
  );
}

const styles = StyleSheet.create({});
