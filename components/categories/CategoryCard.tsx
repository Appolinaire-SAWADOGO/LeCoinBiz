import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export default function CategoryCard({
  id,
  name,
  icon,
  style,
}: {
  id: number;
  name: string;
  icon: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();

  const encodedName = encodeURIComponent(name);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => router.push(`/(root)/Filters?category=${encodedName}`)}
    >
      <Image source={icon} style={styles.icon} />
      <AppText
        fontSize={13}
        color={designSystem.colors.subText}
        style={styles.label}
        font="Medium"
      >
        {name}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: 120,
    height: 70,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,.03)",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.07)",
  },
  icon: {
    width: 25,
    height: 25,
    marginBottom: 3,
  },
  label: {
    textAlign: "center",
  },
});
