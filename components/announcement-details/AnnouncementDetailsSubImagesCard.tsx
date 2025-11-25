import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function AnnouncementDetailsSubImagesCard({
  item,
  index,
  subImageSelected,
  setSubImageSelected,
}: {
  item: string;
  index: number;
  subImageSelected: number;
  setSubImageSelected: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { designSystem } = useAppTheme();

  const isSelected = subImageSelected === index;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setSubImageSelected(index)}
      style={[
        styles.wrapper,
        {
          borderColor: isSelected ? designSystem.colors.primary : "#ccc",
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
    >
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    width: 60,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
