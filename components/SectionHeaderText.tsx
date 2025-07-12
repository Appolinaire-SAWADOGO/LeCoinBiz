import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function SectionHeaderText({
  name,
  withViewAll,
  style,
}: {
  name: string;
  withViewAll: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <AppText font={"Bold"} fontSize={18} color={designSystem.colors.bigText}>
        {name}
      </AppText>

      {withViewAll && (
        <TouchableOpacity
          activeOpacity={0.3}
          style={styles.right}
          onPress={() => router.push("/(root)/AllCategories")}
        >
          <AppText color={designSystem.colors.primary}>Voir tout</AppText>
          <ChevronRight
            width={12}
            height={12}
            color={designSystem.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
