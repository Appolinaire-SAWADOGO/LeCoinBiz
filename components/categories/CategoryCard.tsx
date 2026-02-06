import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { useQueryClient } from "@tanstack/react-query";
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

  const { setCategory, search, subCategory, city, min, max, tempPub, options } =
    useFilterStatesStore();

  const filters = {
    search,
    category: name,
    subCategory,
    city,
    min,
    max,
    tempPub,
    options,
  };

  const queryClient = useQueryClient();

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={async () => {
        setCategory(name);

        router.navigate(`/(root)/Filters?category=${encodedName}`);

        await queryClient.invalidateQueries({
          queryKey: ["filter-ads", filters],
        });
      }}
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
