import { AnnouncementsType } from "@/types";
import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";
import AnnouncementDetailsSubImagesCard from "../AnnouncementDetailsSubImagesCard";

const { width } = Dimensions.get("window");

export default function AnnouncementDetailsImagesSection({
  currentAnnouncement,
}: {
  currentAnnouncement: AnnouncementsType;
}) {
  const [subImageSelected, setSubImageSelected] = React.useState<number>(0);

  return (
    <>
      {/* main image */}
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: currentAnnouncement.image }}
          style={styles.mainImage}
        />
        <View style={styles.imageBadge}>
          <AppText style={styles.badgeText}>
            1/{currentAnnouncement.subPhotos.length + 1}
          </AppText>
        </View>
      </View>

      {/* sub images  */}
      <FlatList
        data={currentAnnouncement.subPhotos}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subImages}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item, index }) => (
          <AnnouncementDetailsSubImagesCard
            subImageSelected={subImageSelected}
            setSubImageSelected={setSubImageSelected}
            item={item}
            index={index}
          />
        )}
      />
    </>
  );
}
const styles = StyleSheet.create({
  imageGallery: {
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: width * 0.9,
    backgroundColor: "#f1f1f1",
  },

  imageBadge: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  subImages: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  subImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 3,
  },
});
