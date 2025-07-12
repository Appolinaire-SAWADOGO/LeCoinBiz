import React from "react";
import { View } from "react-native";
import PostAnAdAddPhotoCard from "../PostAnAdAddPhotoCard";
import PostAnAdPhotosCard from "../PostAnAdPhotosCard";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdPhotosSection() {
  const [images, setImages] = React.useState<string[]>([]);

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
