import { useAppTheme } from "@/hooks/useAppTheme";
import { usePickImage } from "@/hooks/usePickImage";
import { Camera, Plus } from "lucide-react-native";
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
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  pickerDisabled: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();

  const { pickImage } = usePickImage();

  const isPickerDisabled = images.length >= 4;

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!isPickerDisabled)
          await pickImage((img: string) => setImages([...images, img]));
      }}
      disabled={pickerDisabled}
      activeOpacity={0.5}
      style={[
        styles.container,
        { borderColor: designSystem.colors.inputBorder },
        style,
      ]}
    >
      <Camera strokeWidth={1.3} size={36} color={designSystem.colors.bigText} />
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
        <Plus strokeWidth={1.3} color={"#fff"} />
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
