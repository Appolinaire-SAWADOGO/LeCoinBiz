import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function AppButton({
  onPress,
  title,
  disabled,
  style,
  textStyle,
  Icon,
  textColor = "#fff",
  textWeight = "Medium",
}: {
  onPress?: () => void;
  title: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  Icon?: any;
  textColor?: string;
  textWeight?: "Black" | "Bold" | "Medium" | "Light" | "Regular";
}) {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.appButtonContainer,
        {
          backgroundColor: disabled
            ? designSystem.colors.disabled
            : designSystem.colors.primary,
        },
        style,
      ]}
    >
      {Icon && <Icon width={16} height={16} />}

      <View
        style={{
          height: "100%",
          width: "auto",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <AppText
          font={textWeight}
          style={[
            styles.appButtonText,
            { color: textColor && textColor },
            textStyle,
          ]}
        >
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 48,
    elevation: 8,
    borderRadius: 50,
    paddingHorizontal: 14,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});
