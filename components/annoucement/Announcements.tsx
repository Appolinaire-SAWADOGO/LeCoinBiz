import AnnouncementCard from "@/components/annoucement/AnnouncementCard";
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
}) => {
  const { designSystem } = useAppTheme();

  const [openAdId, setOpenAdId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={values || []}
        numColumns={2}
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
            <View style={styles.itemWrapper}>
              <AnnouncementCard
                useCase={announcementCardUseCase}
                ad={item}
                openAdId={openAdId}
                setOpenAdId={setOpenAdId}
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
    maxWidth: "48%",
    marginBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
