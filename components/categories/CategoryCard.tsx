import { useAppTheme } from "@/hooks/useAppTheme";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { MaterialCommunityIconsNameType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { memo, useCallback } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "../custom/AppText";

interface CategoryCardProps {
  id: number;
  name: string;
  icon: MaterialCommunityIconsNameType;
  style?: StyleProp<ViewStyle>;
}

function CategoryCard({ id, name, icon, style }: CategoryCardProps) {
  const { designSystem } = useAppTheme();
  const queryClient = useQueryClient();

  const { setCategory, search, subCategory, city, min, max, tempPub, options } =
    useFilterStatesStore();

  const handlePress = useCallback(async () => {
    setCategory(name);
    router.navigate(`/(root)/Filters?category=${encodeURIComponent(name)}`);
    await queryClient.invalidateQueries({
      queryKey: [
        "filter-ads",
        {
          search,
          category: name,
          subCategory,
          city,
          min,
          max,
          tempPub,
          options,
        },
      ],
    });
  }, [
    name,
    search,
    subCategory,
    city,
    min,
    max,
    tempPub,
    options,
    setCategory,
    queryClient,
  ]);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={icon} size={34} />
      </View>
      <AppText
        fontSize={12}
        style={styles.label}
        font="Medium"
        numberOfLines={2}
      >
        {name}
      </AppText>
    </TouchableOpacity>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  card: {
    // ❌ Supprimer minWidth / maxWidth — la largeur vient du wrapper parent
    // borderColor: "rgba(0,0,0,.07)",'
    alignItems: "center",
  },
  iconWrapper: {},
  label: {
    textAlign: "center",
    marginTop: 4,
    flexShrink: 1,
    flexWrap: "wrap",
    lineHeight: 16, // 12 * 1.33 — standard confortable
    minHeight: 32, // 2 lignes × 16px → aligne tous les labels
  },
});
