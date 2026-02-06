import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  ActivityIndicator,
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
  textWeight = "Bold",
  variant = "primary",
  isLoading = false,
  iconColor = "#fff",
  loaderColor = "#fff",
  loaderSize,
}: {
  onPress?: (() => void) | (() => Promise<void>);
  title: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  Icon?: any;
  textColor?: string;
  textWeight?: "Black" | "Bold" | "Medium" | "Light" | "Regular";
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  iconColor?: string;
  loaderColor?: string;
  loaderSize?: number;
}) {
  const { designSystem } = useAppTheme();

  const buttonVariant = () => {
    const primary = {
      enable: designSystem.colors.primary,
      disable: designSystem.colors.primaryDisabled,
    };

    const secondary = {
      enable: designSystem.colors.secondary,
      disable: designSystem.colors.secondaryDisabled,
    };

    switch (variant) {
      case "primary":
        return primary;
      case "secondary":
        return secondary;
      default:
        return primary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={async () => {
        if (disabled) return;
        await onPress?.();
      }}
      disabled={disabled}
      style={[
        styles.appButtonContainer,
        {
          backgroundColor: disabled
            ? buttonVariant().disable
            : buttonVariant().enable,
        },
        style,
      ]}
    >
      {!isLoading ? (
        <>
          {Icon && <Icon width={16} height={16} fill={iconColor} />}

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
        </>
      ) : (
        <ActivityIndicator size={loaderSize} color={loaderColor} />
      )}
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
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
});
