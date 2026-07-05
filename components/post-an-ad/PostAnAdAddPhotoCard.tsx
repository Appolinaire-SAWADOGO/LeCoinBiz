import { useAppTheme } from "@/hooks/useAppTheme";
import { usePickImage } from "@/hooks/usePickImage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function PostAnAdAddPhotoCard({
  images,
  setImages,
  pickerDisabled,
  style,
  maxFiles,
  slotIndex,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  pickerDisabled: boolean;
  style?: StyleProp<ViewStyle>;
  maxFiles?: number;
  slotIndex?: number; // Index du slot vide à remplir
}) {
  const { designSystem } = useAppTheme();
  const { pickImage } = usePickImage();

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!pickerDisabled)
          await pickImage(
            (imgs: string[]) => {
              // Si slotIndex est fourni, on remplace le slot vide à cet index
              if (slotIndex !== undefined) {
                setImages((prevImages) => {
                  const newImages = [...prevImages];
                  newImages[slotIndex] = imgs[0]; // Prendre la première image sélectionnée
                  return newImages;
                });
              } else {
                // Sinon, on ajoute les images à la fin
                setImages([...images, ...imgs]);
              }
            },
            undefined,
            maxFiles,
          );
      }}
      disabled={pickerDisabled}
      activeOpacity={0.5}
      style={[
        styles.container,
        { borderColor: designSystem.colors.inputBorder },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name="camera-outline"
        size={36}
        color={
          !pickerDisabled ? designSystem.colors.bigText : "rgba(0, 0, 0, 0.4)"
        }
      />
      <View
        style={[
          styles.addImage,
          {
            backgroundColor: !pickerDisabled
              ? designSystem.colors.smallText
              : "rgba(0, 0, 0, 0.4)",
          },
        ]}
      >
        <MaterialCommunityIcons name="plus" size={25} color={"#fff"} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: "dashed",
  },
  addImage: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: -18,
  },
});
