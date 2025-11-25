import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import PostAnAdAddPhotoCard from "../PostAnAdAddPhotoCard";
import PostAnAdPhotosCard from "../PostAnAdPhotosCard";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdPhotosSection({
  value,
  onChange,
  style,
}: {
  value: string[];
  onChange: (imgs: string[]) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [images, setImages] = React.useState<string[]>(value || []);

  useEffect(() => {
    if (images) onChange(images);
  }, [images, onChange]);

  return (
    <PostAnAdSection label="Photos" placeholder="Ajoutez des photos">
      <View
        style={{
          gap: 20,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <PostAnAdAddPhotoCard
          images={images}
          setImages={setImages}
          pickerDisabled={images.length >= 4}
          style={style}
        />
        {images &&
          images.map((image, index) => (
            <PostAnAdPhotosCard
              key={index}
              image={image}
              imgNumber={index + 1}
              images={images}
              setImages={setImages}
            />
          ))}
      </View>
    </PostAnAdSection>
  );
}
