import { useAppTheme } from "@/hooks/useAppTheme";
import { usePickImage } from "@/hooks/usePickImage";
import { Camera, Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function PostAnAdAddPhotoCard({
  images,
  setImages,
  pickerDisabled,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  pickerDisabled: boolean;
}) {
  const { designSystem } = useAppTheme();

  const { pickImage } = usePickImage();

  const isPickerDisabled = images.length >= 4;

  return (
    <TouchableOpacity
      onPress={() => {
        if (!isPickerDisabled)
          pickImage((img: string) => setImages([...images, img]));
      }}
      disabled={pickerDisabled}
      activeOpacity={0.5}
      style={[
        styles.container,
        { borderColor: designSystem.colors.inputBorder },
      ]}
    >
      <Camera size={36} color={designSystem.colors.bigText} />
      <View
        style={[
          styles.addImage,
          {
            backgroundColor: !isPickerDisabled
              ? designSystem.colors.primary
              : "rgba(0, 0, 0, 0.7)",
          },
        ]}
      >
        <Plus color={"#fff"} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
  },
  addImage: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: -18,
  },
});
