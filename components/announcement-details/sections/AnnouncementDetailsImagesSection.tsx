import { useAppTheme } from "@/hooks/useAppTheme";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
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

  // ← NOUVEAU : état vidéo
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false); // cache : déjà chargée ?
  const videoRef = useRef<Video>(null);

  const [videoThumb, setVideoThumb] = useState<string | null>(null);

  useEffect(() => {
    if (video) {
      VideoThumbnails.getThumbnailAsync(video, { time: 0 })
        .then((res) => setVideoThumb(res.uri))
        .catch(() => setVideoThumb(null));
    }
  }, [video]);

  const mediaItems = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...(video ? [{ type: "video" as const, url: video }] : []),
  ];

  const imageUrls = images.map((url) => ({ url }));

  const isVideoSelected =
    video && mediaItems[subImageSelected]?.type === "video";

  // ← Quand on clique sur la vidéo dans les thumbnails
  const handleSelectMedia = (index: number) => {
    setSubImageSelected(index);
    // Si c'est la vidéo et pas encore chargée → montrer loader
    if (mediaItems[index]?.type === "video" && !videoLoaded) {
      setVideoLoading(true);
    }
  };

  // ← Callback quand la vidéo est prête
  const handleVideoStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setVideoLoading(false);
      setVideoLoaded(true); // ← mémorise : plus besoin de recharger
    }
  };

  return (
    <>
      {/* Main media */}
      <View style={styles.imageGallery}>
        {/* ← Vidéo TOUJOURS montée, juste cachée si pas sélectionnée */}
        {video && (
          <View
            style={[
              styles.videoContainer,
              !isVideoSelected && {
                position: "absolute",
                opacity: 0,
                zIndex: -1,
              },
            ]}
          >
            <Video
              ref={videoRef}
              source={{ uri: video }}
              style={styles.mainImage}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={!!isVideoSelected} // ← joue automatiquement quand sélectionnée ✅
              onPlaybackStatusUpdate={handleVideoStatus}
            />
            {videoLoading && (
              <View style={styles.videoLoader}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        )}

        {/* ← Image seulement si pas vidéo sélectionnée */}
        {!isVideoSelected && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsZoomVisible(true)}
          >
            <Image
              source={{ uri: images[subImageSelected] }}
              style={styles.mainImage}
            />
          </TouchableOpacity>
        )}

        <View
          style={[styles.imageBadge, isVideoSelected && styles.imageBadgeVideo]}
        >
          <AppText style={styles.badgeText}>
            {subImageSelected + 1}/{mediaItems.length}
          </AppText>
        </View>
      </View>

      {/* Sub thumbnails */}
      <FlatList
        data={mediaItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subImages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
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
        )}
      />

      {/* Modal zoom images */}
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
    top: 15, // ← en haut pour la vidéo
    right: 15,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  subImages: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    flex: 1,
    justifyContent: "center",
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
