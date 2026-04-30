import AppText from "@/components/custom/AppText";
import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import PostAnAdAddPhotoCard from "../PostAnAdAddPhotoCard";
import PostAnAdPhotosCard from "../PostAnAdPhotosCard";
import PostAnAdSection from "../PostAnAdSection";
import PostAnAdAddVideoCard from "./PostAnAdAddVideoCard";
import PostAnAdVideoCard from "./PostAnAdVideoCard";

export default function PostAnAdPhotosSection({
  value,
  onChange,
  video,
  onVideoChange,
  style,
}: {
  value: string[];
  onChange: (imgs: string[]) => void;
  video?: string;
  onVideoChange: (uri: string | undefined) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [images, setImages] = React.useState<string[]>(value || []);

  useEffect(() => {
    if (images) onChange(images);
  }, [images, onChange]);

  // Max 3 images si vidéo présente, 4 sans vidéo
  const maxImages = video ? 3 : 4;
  const canAddVideo = images.length <= 3 && !video;

  return (
    <PostAnAdSection label="Photos & Vidéo" placeholder="Ajoutez des photos">
      <View
        style={{
          gap: 20,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {/* Bouton ajout photo */}
        <PostAnAdAddPhotoCard
          images={images}
          setImages={setImages}
          pickerDisabled={images.length >= maxImages}
          style={style}
        />

        {/* Photos */}
        {images.map((image, index) => (
          <PostAnAdPhotosCard
            key={index}
            image={image}
            imgNumber={index + 1}
            images={images}
            setImages={setImages}
          />
        ))}

        {/* Bouton ajout vidéo */}
        <PostAnAdAddVideoCard
          disabled={!canAddVideo}
          onVideoSelected={onVideoChange}
          style={style}
        />

        {/* Vidéo sélectionnée */}
        {video && (
          <PostAnAdVideoCard
            uri={video}
            onRemove={() => onVideoChange(undefined)}
          />
        )}
      </View>

      {/* Indication limite */}
      <AppText style={{ fontSize: 11, color: "#999" }}>
        {`Max ${maxImages} photos${!video ? " + 1 vidéo (30 sec max)" : ""}`}
      </AppText>
    </PostAnAdSection>
  );
}
