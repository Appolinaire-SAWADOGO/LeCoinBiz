import { usePickImage } from "@/hooks/usePickImage";
import { Edit, Trash } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function PostAnAdPhotosCard({
  image,
  images,
  setImages,
  imgNumber,
}: {
  image: string;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  imgNumber: number;
}) {
  const { pickImage } = usePickImage();

  const editPhoto = () => {
    pickImage((img: string) => {
      const newImages = images;
      newImages[imgNumber - 1] = img;
      setImages([...newImages]);
    });
  };

  const removeImg = () => {
    const newImages = images.filter((img) => img !== image);
    setImages([...newImages]);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.rmORReplaceImg}>
        <TouchableOpacity
          onPress={() => editPhoto()}
          activeOpacity={0.5}
          style={[styles.icon, { backgroundColor: "#fff" }]}
        >
          <Edit strokeWidth={1.5} size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeImg()}
          activeOpacity={0.5}
          style={[styles.icon, { backgroundColor: "red" }]}
        >
          <Trash strokeWidth={1.5} size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  rmORReplaceImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.5)",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
