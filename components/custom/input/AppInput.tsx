import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
} from "react-native";

export default function AppInput({
  onChangeText,
  onSubmitEditing,
  value,
  placeholder,
  keyboardType,
  style,
  model = "withoutBorder",
  maxLength,
  editable = true,
  autoCapitalize,
  autoComplete,
  viewLenght = 48,
  multiline = false,
}: {
  onChangeText?: ((text: string) => void) | undefined;
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
  value?: string | undefined;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  style?: StyleProp<TextStyle>;
  model?: "withBorder" | "withoutBorder";
  maxLength?: number;
  editable?: boolean | undefined;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  autoComplete?: any;
  viewLenght?: number;
  multiline?: boolean;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={{ height: viewLenght }}>
      <TextInput
        editable={editable}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
        multiline={multiline}
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
