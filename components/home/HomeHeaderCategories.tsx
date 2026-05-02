import { CATEGORIES } from "@/constants/categories";
import { MaterialCommunityIconsNameType } from "@/types";
import React, { useCallback, useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CategoryCard from "../categories/CategoryCard";

type Category = {
  id: number;
  name: string;
  icon: MaterialCommunityIconsNameType;
};

const CARD_WIDTH = 90;
const GAP = 12;
const ITEM_WIDTH = CARD_WIDTH + GAP;
const INTERVAL_MS = 3000;

export default function HomeCategories() {
  const flatListRef = useRef<FlatList<Category>>(null);
  const currentIndexRef = useRef(0);

  const scrollToNext = useCallback(() => {
    const next = (currentIndexRef.current + 1) % CATEGORIES.length;
    currentIndexRef.current = next;
    flatListRef.current?.scrollToIndex({
      index: next,
      animated: true,
      viewPosition: 0,
    });
  }, []);

  useEffect(() => {
    const id = setInterval(scrollToNext, INTERVAL_MS);
    return () => clearInterval(id);
  }, [scrollToNext]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={CATEGORIES}
        style={styles.list}
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          flatListRef.current?.scrollToOffset({
            offset: index * averageItemLength,
            animated: true,
          });
        }}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.itemWrapper,
              index === CATEGORIES.length - 1 && styles.lastItem,
            ]}
          >
            <CategoryCard id={item.id} name={item.name} icon={item.icon} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  list: {},
  content: {
    alignItems: "flex-start",
  },
  itemWrapper: {
    maxWidth: CARD_WIDTH,
    minWidth: "auto",
    marginRight: GAP,
    // borderWidth: 1,
  },
  lastItem: {
    marginRight: 0,
  },
});
