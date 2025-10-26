import AppInput from "@/components/custom/input/AppInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormPriceSection({
  onChangeText,
  value,
  placeholder,
  maxLength,
}: {
  onChangeText: (value: string) => void;
  value: string | undefined;
  placeholder: string;
  maxLength?: number;
}) {
  const { designSystem } = useAppTheme();

  const handleChangeText = (val: string) => {
    const onlyNumbers = val.replace(/[^0-9]/g, "");
    onChangeText(onlyNumbers);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        keyboardType="numeric"
        maxLength={maxLength}
        style={[
          styles.input,
          {
            backgroundColor: value
              ? designSystem.colors.primaryLight
              : "#f5f5f5",
            borderWidth: value ? 1 : 0,
            borderColor: value ? designSystem.colors.primary : "#f5f5f5",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
});
