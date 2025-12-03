import AnnouncementCard from "@/components/announcement/AnnouncementCard";
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
import ProfileDelOrEdAnnouncement from "../profile/ProfileDelOrEdAnnouncement";

export default function ProfileAnnouncements({
  scrollY,
  style,
  status,
}: {
  scrollY?: Animated.Value;
  style?: StyleProp<ViewStyle>;
  status: "inSell" | "disabled";
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        numColumns={2}
        contentContainerStyle={[style, { paddingHorizontal: 20 }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator
        keyExtractor={(item) => item.id.toString()}
        onScroll={(e) => {
          scrollY?.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <AnnouncementCard
              useCase="ProfilePage"
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              city={item.location.city}
              country={item.location.pays}
            >
              <ProfileDelOrEdAnnouncement status={status} />
            </AnnouncementCard>
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
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
});
