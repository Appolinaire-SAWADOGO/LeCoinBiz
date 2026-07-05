import { useAppTheme } from "@/hooks/useAppTheme";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import AppText from "../../custom/AppText";

const { width } = Dimensions.get("window");

export default function AnnouncementDetailsImagesSection({
  images,
  video,
}: {
  images: string[];
  video?: string;
}) {
  const { designSystem } = useAppTheme();
  const [subImageSelected, setSubImageSelected] = React.useState<number>(0);
  const [isZoomVisible, setIsZoomVisible] = React.useState<boolean>(false);

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const [videoThumb, setVideoThumb] = useState<string | null>(null);

  const carouselRef = useRef<ICarouselInstance>(null);

  useEffect(() => {
    if (video) {
      VideoThumbnails.getThumbnailAsync(video, { time: 0 })
        .then((res) => setVideoThumb(res.uri))
        .catch(() => setVideoThumb(null));
    }
  }, [video]);

  //  Mémoïsés : gardent la même référence tant que video/images ne changent pas réellement
  const mediaItems = React.useMemo(
    () => [
      ...(video ? [{ type: "video" as const, url: video }] : []),
      ...images.map((url) => ({ type: "image" as const, url })),
    ],
    [video, images],
  );

  const imageUrls = React.useMemo(
    () => images.map((url) => ({ url })),
    [images],
  );

  const handleSelectMedia = (index: number) => {
    setSubImageSelected(index);
    carouselRef.current?.scrollTo({ index, animated: true });

    if (mediaItems[index]?.type === "video" && !videoLoaded) {
      setVideoLoading(true);
    }
  };

  const handleSnapToItem = (index: number) => {
    setSubImageSelected(index);
    if (mediaItems[index]?.type === "video" && !videoLoaded) {
      setVideoLoading(true);
    }
  };

  const handleVideoStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setVideoLoading(false);
      setVideoLoaded(true);
    }
  };

  const isVideoSelected = mediaItems[subImageSelected]?.type === "video";

  return (
    <>
      {/* Main media carousel */}
      <View style={styles.imageGallery}>
        <Carousel
          ref={carouselRef}
          width={width}
          height={width * 0.9}
          data={mediaItems}
          defaultIndex={0}
          onSnapToItem={handleSnapToItem}
          renderItem={({ item, index }) => {
            if (item.type === "video") {
              const isCurrentVideo = index === subImageSelected;
              return (
                <View style={styles.videoContainer}>
                  <Video
                    source={{ uri: item.url }}
                    style={styles.mainImage}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    onPlaybackStatusUpdate={handleVideoStatus}
                  />
                  {videoLoading && isCurrentVideo && (
                    <View style={styles.videoLoader}>
                      <ActivityIndicator size="large" color="#fff" />
                    </View>
                  )}
                </View>
              );
            }

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsZoomVisible(true)}
              >
                <Image source={{ uri: item.url }} style={styles.mainImage} />
              </TouchableOpacity>
            );
          }}
        />

        <View
          style={[styles.imageBadge, isVideoSelected && styles.imageBadgeVideo]}
        >
          <AppText style={styles.badgeText}>
            {subImageSelected + 1}/{mediaItems.length}
          </AppText>
        </View>
      </View>

      {/* Sub thumbnails */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subImagesContainer}
        contentContainerStyle={styles.subImages}
      >
        {mediaItems.map((item, index) => (
          <TouchableOpacity
            key={`${item.type}-${index}`}
            onPress={() => handleSelectMedia(index)}
            style={[
              styles.subImageWrapper,
              subImageSelected === index && {
                borderColor: designSystem.colors.primary,
              },
            ]}
          >
            {item.type === "video" ? (
              <View style={styles.videoThumb}>
                {videoThumb ? (
                  <Image source={{ uri: videoThumb }} style={styles.subImage} />
                ) : images[0] ? (
                  <Image
                    source={{ uri: images[0] }}
                    style={[styles.subImage, { opacity: 0.5 }]}
                  />
                ) : null}
                <View style={styles.playOverlay}>
                  <AppText style={styles.playIcon}>▶</AppText>
                </View>
              </View>
            ) : (
              <Image source={{ uri: item.url }} style={styles.subImage} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal zoom images */}
      <Modal
        visible={isZoomVisible}
        transparent={true}
        onRequestClose={() => setIsZoomVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={isVideoSelected ? 0 : subImageSelected - (video ? 1 : 0)}
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
          onChange={(index) =>
            setSubImageSelected((index || 0) + (video ? 1 : 0))
          }
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
  imageGallery: { position: "relative" },
  mainImage: {
    width: "100%",
    height: width * 0.9,
    backgroundColor: "#f1f1f1",
  },
  videoContainer: {
    width: "100%",
    height: width * 0.9,
    backgroundColor: "#000",
  },
  videoLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  imageBadge: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 10,
  },
  imageBadgeVideo: {
    bottom: undefined,
    top: 15,
    right: 15,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  subImagesContainer: {
    marginHorizontal: 20,
  },
  subImages: {
    paddingVertical: 20,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  subImageWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  subImage: { width: 60, height: 60, borderRadius: 8 },
  videoThumb: {
    width: 60,
    height: 60,
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  playIcon: { color: "#fff", fontSize: 22 },
  zoomIndicator: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  zoomIndicatorText: { color: "#fff", fontSize: 14 },
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
  closeButtonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
});
