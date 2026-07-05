import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function PostAnAdPhotosCard({
  image,
  imgNumber,
  images,
  setImages,
  style,
}: {
  image: string;
  imgNumber: number;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  style?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();

  const handleRemove = () => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[imgNumber - 1] = ""; // Remplacer par une chaîne vide au lieu de supprimer
      return newImages;
    });
  };

  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity
        onPress={handleRemove}
        activeOpacity={0.7}
        style={styles.deleteBtn}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
      <View
        style={[
          styles.indexBadge,
          { backgroundColor: designSystem.colors.infoCard },
        ]}
      >
        <Text
          style={[styles.indexText, { color: designSystem.colors.bigText }]}
        >
          {imgNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  indexBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
