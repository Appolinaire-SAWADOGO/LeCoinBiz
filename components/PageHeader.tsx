import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./custom/AppText";

import { useAppTheme } from "@/hooks/useAppTheme";

export default function PageHeader({
  name,
  style,
  children,
  iconColor,
  onBack,
}: {
  name?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  iconColor?: string;
  onBack?: () => void;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={[
        styles.header,
        { borderBottomColor: designSystem.colors.inputBorder },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (onBack) onBack();
          else router.back();
        }}
        hitSlop={10}
      >
        <ArrowLeft size={22} color={iconColor || designSystem.colors.bigText} />
      </TouchableOpacity>

      {name && (
        <AppText fontSize={18} font="Bold">
          {name}
        </AppText>
      )}

      {children ? children : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
});
