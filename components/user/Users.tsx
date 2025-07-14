import React from "react";
import {
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import UserCard from "./UserCard";

export default function Users({
  scrollY,
  style,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        contentContainerStyle={[style, { paddingHorizontal: 20 }]}
        showsVerticalScrollIndicator
        keyExtractor={(item) => item.toString()}
        onScroll={(e) => {
          scrollY?.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={() => <UserCard />}
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
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
});
