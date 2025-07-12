import { announcements } from "@/constants/announcements";
import React from "react";
import {
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import SimilarAnnoucementCard from "./SimilarAnnoucementCard";

export default function SimilarAnnoucements({
  scrollY,
  style,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        contentContainerStyle={[style]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={(e) => {
          scrollY?.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <SimilarAnnoucementCard
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              city={item.location.city}
              country={item.location.pays}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
});
