import AppText from "@/components/custom/AppText";
import AppInput from "@/components/custom/input/AppInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormPriceMinMaxSection({
  min,
  setMin,
  max,
  setMax,
}: {
  min: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  max: string;
  setMax: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <>
      <AppText style={styles.label}>Prix minimum / maximum</AppText>
      <View style={styles.priceFilterContainer}>
        <View style={{ flex: 1 }}>
          <AppInput
            onChangeText={
              setMin as React.Dispatch<React.SetStateAction<string>>
            }
            placeholder="Minimum"
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: min
                  ? designSystem.colors.primaryLight
                  : "#f5f5f5",
                borderWidth: min ? 1 : 0,
                borderColor: min ? designSystem.colors.primary : "#f5f5f5",
              },
            ]}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            onChangeText={
              setMax as React.Dispatch<React.SetStateAction<string>>
            }
            placeholder="Maximum"
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: max
                  ? designSystem.colors.primaryLight
                  : "#f5f5f5",
                borderWidth: max ? 1 : 0,
                borderColor: max ? designSystem.colors.primary : "#f5f5f5",
              },
            ]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    marginTop: 14,
  },
  priceFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
});
