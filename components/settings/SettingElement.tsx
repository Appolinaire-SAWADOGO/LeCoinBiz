import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIconsNameType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function SettingElement({
  icon,
  label,
  color,
  fill = "#fff",
  onClick,
  children,
  disabled,
  size = 18,
}: {
  icon: MaterialCommunityIconsNameType;
  label: string;
  color: string;
  fill?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  size?: number;
}) {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onClick?.()}
      style={styles.content}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View style={[styles.icon, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon} size={size} color={"#fff"} />
        </View>

        <AppText
          font="Medium"
          fontSize={14}
          color={designSystem.colors.smallText}
        >
          {label}
        </AppText>
      </View>

      {children ? children : <View />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
