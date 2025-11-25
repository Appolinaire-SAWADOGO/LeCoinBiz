import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";
import AnnouncementDetailsSubImagesCard from "../AnnouncementDetailsSubImagesCard";

const { width } = Dimensions.get("window");

export default function AnnouncementDetailsImagesSection({
  images,
}: {
  images: string[];
}) {
  const [subImageSelected, setSubImageSelected] = React.useState<number>(0);

  return (
    <>
      {/* main image */}
      {images && (
        <View style={styles.imageGallery}>
          <Image
            source={{ uri: images[subImageSelected] }}
            style={styles.mainImage}
          />
          <View style={styles.imageBadge}>
            <AppText style={styles.badgeText}>
              {subImageSelected + 1}/{images.length}
            </AppText>
          </View>
        </View>
      )}

      {/* sub images  */}
      <FlatList
        data={images}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    flex: 1,
    justifyContent: "center",
  },
});
