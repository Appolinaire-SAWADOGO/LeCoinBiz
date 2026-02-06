import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import AppText from "../../custom/AppText";
import AnnouncementDetailsSubImagesCard from "../AnnouncementDetailsSubImagesCard";

const { width, height } = Dimensions.get("window");

export default function AnnouncementDetailsImagesSection({
  images,
}: {
  images: string[];
}) {
  const [subImageSelected, setSubImageSelected] = React.useState<number>(0);
  const [isZoomVisible, setIsZoomVisible] = React.useState<boolean>(false);

  // Formater les images pour le viewer
  const imageUrls = images.map((url) => ({ url }));

  return (
    <>
      {/* main image */}
      {images && (
        <View style={styles.imageGallery}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsZoomVisible(true)}
          >
            <Image
              source={{ uri: images[subImageSelected] }}
              style={styles.mainImage}
            />
          </TouchableOpacity>
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

      {/* Modal de zoom */}
      <Modal
        visible={isZoomVisible}
        transparent={true}
        onRequestClose={() => setIsZoomVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={subImageSelected}
          onSwipeDown={() => setIsZoomVisible(false)}
          enableSwipeDown={true}
          backgroundColor="black"
          renderIndicator={(currentIndex, allSize) => (
            <View style={styles.zoomIndicator}>
              <AppText style={styles.zoomIndicatorText}>
                {currentIndex}/{allSize}
              </AppText>
            </View>
          )}
          onChange={(index) => setSubImageSelected(index || 0)}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsZoomVisible(false)}
        >
          <AppText style={styles.closeButtonText}>✕</AppText>
        </TouchableOpacity>
      </Modal>
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
  zoomIndicator: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  zoomIndicatorText: {
    color: "#fff",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
