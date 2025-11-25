import { AnnouncementType } from "@/types";
import React from "react";
import {
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import AnnouncementCard from "../annoucement/AnnouncementCard";

export default function SimilarAnnoucements({
  scrollY,
  style,
  data,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
  data: AnnouncementType[];
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={[style]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={(e) => {
          scrollY?.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({ item, index }) => (
          <View style={styles.itemWrapper}>
            <AnnouncementCard ad={item} type="similar" />
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
    marginBottom: 10,
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 6,
  },
});
