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
import AnnouncementCard from "./AnnouncementCard";

export default function VerticalScollAnnoucements({
  scrollY,
  style,
  containerStyle,
  itemWrapperStyle,
  data,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  itemWrapperStyle?: StyleProp<ViewStyle>;
  data: AnnouncementType[];
}) {
  return (
    <View style={[styles.container, containerStyle]}>
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
          <View style={[styles.itemWrapper, itemWrapperStyle]}>
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
