import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  onPress,
}: {
  name: string;
  withViewAll: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
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
          onPress={onPress}
        >
          <AppText color={designSystem.colors.primary}>Voir tout</AppText>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
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
