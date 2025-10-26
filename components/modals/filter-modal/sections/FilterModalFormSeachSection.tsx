import AppText from "@/components/custom/AppText";
import AppInput from "@/components/custom/input/AppInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormSeachSection({
  search,
  onChange,
}: {
  search?: string | null;
  onChange: (search: string) => void;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View>
      <AppText style={styles.label}>Recherche</AppText>
      <AppInput
        placeholder="Recherche..."
        value={search ?? ""}
        onChangeText={(text) => onChange(text.replace(/^\s+/, ""))}
        style={{
          borderWidth: 1,
          borderColor: search
            ? designSystem.colors.primary
            : designSystem.colors.inputBorder,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    marginTop: 14,
  },
});
