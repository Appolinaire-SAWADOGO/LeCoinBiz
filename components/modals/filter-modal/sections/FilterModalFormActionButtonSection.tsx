import AppButton from "@/components/custom/AppButton";
import React from "react";
import { StyleSheet } from "react-native";

export default function FilterModalFormActionButtonSection({
  onPress,
  isLoading,
}: {
  onPress: () => void;
  isLoading: boolean;
}) {
  return (
    <AppButton
      title="Appliquer les filtres"
      style={[styles.applyButton]}
      textStyle={styles.applyText}
      onPress={onPress}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  applyButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 0,
  },
  applyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
