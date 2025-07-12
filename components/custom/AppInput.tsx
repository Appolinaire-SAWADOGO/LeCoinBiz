import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from "react-native";

export default function AppInput({
  onChangeText,
  value,
  placeholder,
  keyboardType,
  style,
  model = "withoutBorder",
}: {
  onChangeText?: ((text: string) => void) | undefined;
  value?: string | undefined;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  style?: StyleProp<TextStyle>;
  model?: "withBorder" | "withoutBorder";
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={{ height: 48 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
        style={[
          styles.input,
          {
            fontFamily: designSystem.fontFamily,
            borderColor: designSystem.colors.inputBorder,
          },
          model === "withBorder"
            ? {
                borderWidth: 1,
                backgroundColor: "transparent",
              }
            : {
                backgroundColor: designSystem.colors.inputBackground,
                color: designSystem.colors.bigText,
              },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    height: 48,
  },
});
