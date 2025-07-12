import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function SettingElement({
  Icon,
  label,
  color,
  fill = "#fff",
  onClick,
  children,
  disabled,
}: {
  Icon: LucideIcon;
  label: string;
  color: string;
  fill?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
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
          <Icon width={18} height={18} fill={fill} stroke={"#fff"} />
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
