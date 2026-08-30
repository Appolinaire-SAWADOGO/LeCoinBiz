import Announcements from "@/components/announcement/Announcements";
import NoData from "@/components/announcement/NoData";
import Container from "@/components/Container";
import AppSearchInput from "@/components/custom/input/AppSearchInput";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import FilterModalButton from "@/components/modals/filter-modal/FilterModalButton";
import FilterModalForm from "@/components/modals/filter-modal/FilterModalForm";
import FiltersSearchModal from "@/components/modals/filter-modal/FiltersSearchModal";
import PageHeader from "@/components/PageHeader";
import { useGetFilterAds } from "@/hooks/services/ads/useGetFilterAds";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFiltersSearchModalStore } from "@/store/useFiltersSearchModalStore";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Filters() {
  const scrollY = new Animated.Value(0);

  const { designSystem } = useAppTheme();

  const { getFilterAds } = useGetFilterAds();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const search = useFilterStatesStore((state) => state.search);
  const categoryFilter = useFilterStatesStore((state) => state.category);
  const subCategory = useFilterStatesStore((state) => state.subCategory);
  const city = useFilterStatesStore((state) => state.city);
  const min = useFilterStatesStore((state) => state.min);
  const max = useFilterStatesStore((state) => state.max);
  const tempPub = useFilterStatesStore((state) => state.tempPub);
  const options = useFilterStatesStore((state) => state.options);

  const open = useFilterStatesStore((state) => state.open);
  const isOpen = useFilterStatesStore((state) => state.isOpen);
  const close = useFilterStatesStore((state) => state.close);
  const reseFilters = useFilterStatesStore((state) => state.resetFilters);
  const setSearch = useFilterStatesStore((state) => state.setSeach);

  const filtersSearchModalIsOpen = useFiltersSearchModalStore(
    (state) => state.isOpen,
  );
  const filtersSearchModalClose = useFiltersSearchModalStore(
    (state) => state.close,
  );
  const filtersSearchModalOpen = useFiltersSearchModalStore(
    (state) => state.open,
  );

  const filters = useMemo(
    () => ({
      search,
      category: categoryFilter,
      subCategory,
      city,
      min,
      max,
      tempPub,
      options,
    }),
    [search, categoryFilter, subCategory, city, min, max, tempPub, options],
  );

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["filter-ads"],
    queryFn: (context) =>
      getFilterAds({
        pageParam: context.pageParam,
        filtersStatesStore: filters,
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
  }, [filters, queryClient]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    return () => reseFilters();
  }, [reseFilters]);

  const hasAds = allAds && allAds.length > 0;
  const initialLoading = isLoading && !hasAds;

  const insets = useSafeAreaInsets();

  // jsonLog("logs", allAds);

  return (
    <Container style={styles.container} withBottom withGoBack>
      {/* header */}
      <HeaderHideAnimation
        scrollY={scrollY}
        headerHeight={190}
        style={{
          top: insets.top,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingBottom: 5,
        }}
      >
        <PageHeader>
          <AppSearchInput
            filtersSearchModalOpen={filtersSearchModalOpen}
            search={search}
            editable={false}
            activeOpacity={0.5}
            setSearch={setSearch}
            onRefresh={onRefresh}
          />
        </PageHeader>

        <FilterModalButton open={open} />
      </HeaderHideAnimation>

      {/* Liste d'annonces */}
      <Announcements
        refreshControl={
          <RefreshControl
            refreshing={refreshing || initialLoading || isFetching}
            onRefresh={onRefresh}
            colors={[designSystem.colors.primary]}
            tintColor={designSystem.colors.primary}
            progressViewOffset={120}
          />
        }
        values={allAds}
        scrollY={scrollY}
        style={{ paddingBottom: 60, paddingTop: 145 }}
        onEndReached={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />

      {/* Message "aucune annonce" */}
      {!initialLoading && !hasAds && (
        <NoData
          text="Aucune annonce disponible pour le moment. Veuillez réessayer plus tard
              ou ajuster vos filtres."
        />
      )}

      {/* Modals */}
      <FilterModalForm isOpen={isOpen} close={close} useCase="Filter" />
      <FiltersSearchModal
        search={search}
        isOpen={filtersSearchModalIsOpen}
        onClose={filtersSearchModalClose}
        onRefresh={onRefresh}
        setSearch={setSearch}
        filters={filters}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
  },
});
