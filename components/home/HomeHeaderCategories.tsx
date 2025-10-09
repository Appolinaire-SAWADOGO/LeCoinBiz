import React, { useEffect, useRef, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";
import CategoryCard from "../categories/CategoryCard";
import {CATEGORIES} from "@/constants/categories";

type Category = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
};

export default function HomeCategories() {
  const flatListRef = useRef<FlatList<Category>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= CATEGORIES.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentIndex, CATEGORIES.length]);

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        style={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard id={item.id} name={item.name} icon={item.icon} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  list: {},
});
