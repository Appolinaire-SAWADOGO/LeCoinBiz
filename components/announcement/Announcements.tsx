import AnnouncementCard from "@/components/announcement/AnnouncementCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControlProps,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

const Announcements = ({
  scrollY,
  style,
  values,
  refreshControl,
  onEndReached,
  isLoadingMore,
  ListHeaderComponent,
  announcementCardUseCase,
  profileAdsSelectedStatus,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
  values?: AnnouncementType[];

  refreshControl?: React.ReactElement<RefreshControlProps>;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
  announcementCardUseCase?: "OtherPage" | "ProfilePage";
  profileAdsSelectedStatus?: number;
}) => {
  const { designSystem } = useAppTheme();

  const [openAdId, setOpenAdId] = useState<string | null>(null);

  const { width } = useWindowDimensions();

  const isTablet = width >= 700;
  const numColumns = isTablet ? 3 : 2;

  const itemWidth = isTablet ? "31%" : "48%";

  return (
    <View style={styles.container}>
      <FlatList
        data={values || []}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={[style, { paddingHorizontal: 20 }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator
        keyExtractor={(item, index) => item?.id?.toString() || `item-${index}`}
        onScroll={(e) => {
          const scrollYValue = e.nativeEvent.contentOffset.y;
          scrollY?.setValue(scrollYValue);
        }}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size="large"
                color={designSystem.colors.primary}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          if (!item || !item.id) return null;

          return (
            <View style={[styles.itemWrapper, { maxWidth: itemWidth }]}>
              <AnnouncementCard
                useCase={announcementCardUseCase}
                ad={item}
                openAdId={openAdId}
                setOpenAdId={setOpenAdId}
                profileAdsSelectedStatus={
                  announcementCardUseCase === "ProfilePage"
                    ? (profileAdsSelectedStatus as number)
                    : null
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    marginBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
