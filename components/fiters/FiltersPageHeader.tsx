import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React from "react";
import { Animated, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderHideAnimation from "../HeaderHideAnimation";
import PageHeader from "../PageHeader";
import FilterModal from "../modals/filter-modal/FilterModal";

export default function FiltersPageHeader({
  category,
  scrollY,
}: {
  category: string;
  scrollY: Animated.Value;
}) {
  const insets = useSafeAreaInsets();
  const { designSystem } = useAppTheme();
  return (
    <HeaderHideAnimation
      scrollY={scrollY}
      headerHeight={190}
      style={{
        top: insets.top,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 5,
      }}
    >
      <PageHeader name={category as string}>
        <TouchableOpacity onPress={() => router.push("/(root)/Search")}>
          <Search size={22} color={designSystem.colors.bigText} />
        </TouchableOpacity>
      </PageHeader>

      <FilterModal />
    </HeaderHideAnimation>
  );
}
