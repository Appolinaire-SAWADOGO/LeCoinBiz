import AnnouncementCard from "@/components/annoucement/AnnouncementCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementsType } from "@/types";
import React, { forwardRef } from "react";
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

const Announcements = forwardRef<
  FlatList,
  {
    scrollY?: Animated.Value;
    style?: StyleProp<ViewStyle>;
    values?: AnnouncementsType[];
    refreshControl?: React.ReactElement<RefreshControlProps>;
    onEndReached?: () => void;
    isLoadingMore?: boolean;
    onScroll?: (e: any) => void;
  }
>(
  (
    {
      scrollY,
      style,
      values,
      refreshControl,
      onEndReached,
      isLoadingMore,
      onScroll,
    },
    ref
  ) => {
    const { designSystem } = useAppTheme();

    return (
      <View style={styles.container}>
        <FlatList
          ref={ref}
          data={values || []}
          numColumns={2}
          contentContainerStyle={[style, { paddingHorizontal: 20 }]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator
          keyExtractor={(item, index) =>
            item?.id?.toString() || `item-${index}`
          }
          onScroll={(e) => {
            const scrollYValue = e.nativeEvent.contentOffset.y;

            // Met à jour l'animation du header en temps réel
            scrollY?.setValue(scrollYValue);

            // Si un onScroll custom est fourni, l'appeler aussi
            onScroll?.(e);
          }}
          scrollEventThrottle={16} // 60fps pour une animation fluide
          refreshControl={refreshControl}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
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
                  id={item.id}
                  name={item.title}
                  image={item.images[0]}
                  price={item.price}
                  city={item.city}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }
);

// Ajouter displayName pour ESLint et React DevTools
Announcements.displayName = "Announcements";

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
