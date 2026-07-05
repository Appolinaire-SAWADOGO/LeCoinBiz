import AppText from "@/components/custom/AppText";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import PostAnAdAddPhotoCard from "../PostAnAdAddPhotoCard";
import PostAnAdPhotosCard from "../PostAnAdPhotosCard";
import PostAnAdSection from "../PostAnAdSection";
import PostAnAdAddVideoCard from "./PostAnAdAddVideoCard";
import PostAnAdVideoCard from "./PostAnAdVideoCard";

const GRID_GAP = 12;
const CARD_SIZE = 100;
const MAX_PHOTOS = 5; // <-- indépendant de la vidéo

export default function PostAnAdPhotosSection({
  value,
  onChange,
  video,
  onVideoChange,
  style,
  errors,
}: {
  value: string[];
  onChange: (imgs: string[]) => void;
  video?: string;
  onVideoChange: (uri: string | undefined) => void;
  style?: StyleProp<ViewStyle>;
  errors?: any;
}) {
  const [images, setImages] = React.useState<string[]>(value || []);

  useEffect(() => {
    const nextValue = value || [];
    const isSame =
      images.length === nextValue.length &&
      images.every((img, index) => img === nextValue[index]);

    if (!isSame) {
      setImages(nextValue);
    }
  }, [value, images]);

  const setImagesAndSync: React.Dispatch<React.SetStateAction<string[]>> = (
    updater,
  ) => {
    setImages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onChange(next);
      return next;
    });
  };

  const canAddVideo = !video; // <-- ne dépend plus du nombre de photos

  console.log(images);

  return (
    <PostAnAdSection label="Photos" placeholder="">
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          <View style={styles.cardWrapper}>
            <PostAnAdAddPhotoCard
              images={images}
              setImages={setImagesAndSync}
              pickerDisabled={images.length >= MAX_PHOTOS}
              style={[style, styles.cardInner]}
              maxFiles={MAX_PHOTOS - images.length}
            />
          </View>

          {images.map((image, index) => (
            <View key={index} style={styles.cardWrapper}>
              {image ? (
                <PostAnAdPhotosCard
                  image={image}
                  imgNumber={index + 1}
                  images={images}
                  setImages={setImagesAndSync}
                  style={styles.cardInner}
                />
              ) : (
                <PostAnAdAddPhotoCard
                  images={images}
                  setImages={setImagesAndSync}
                  pickerDisabled={false}
                  style={[style, styles.cardInner]}
                  maxFiles={1}
                  slotIndex={index}
                />
              )}
            </View>
          ))}
        </ScrollView>
        <AppText style={styles.limitText}>Max 5 photos</AppText>

        {errors && (
          <AppText style={{ color: "red", marginTop: 10 }}>
            {errors.message}
          </AppText>
        )}
      </View>

      <View style={styles.videoSection}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <AppText font="Medium">Vidéo</AppText>
          <AppText
            style={{ fontSize: 12, fontStyle: "italic" }}
            color={"#8a8d92"}
          >
            optionnel
          </AppText>
        </View>

        <View style={[styles.cardWrapper, { marginBottom: 10 }]}>
          {!video ? (
            <PostAnAdAddVideoCard
              disabled={!canAddVideo}
              onVideoSelected={onVideoChange}
              style={[styles.cardInner]}
            />
          ) : (
            <PostAnAdVideoCard
              uri={video}
              onRemove={() => onVideoChange(undefined)}
              style={styles.cardInner}
            />
          )}
        </View>

        <AppText style={styles.limitText}>1 vidéo (30 sec max)</AppText>
      </View>
    </PostAnAdSection>
  );
}

const styles = StyleSheet.create({
  photoScroll: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 16,
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginRight: GRID_GAP,
  },
  cardInner: {
    width: "100%",
    height: "100%",
  },
  videoSection: {
    justifyContent: "flex-start",
    marginBottom: 16,
    gap: 8,
    marginTop: 16,
  },
  limitText: {
    fontSize: 11,
    color: "#999",
    marginTop: 10,
  },
});
