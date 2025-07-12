import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function FilterModalFormActionButton({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.applyButton,
        { backgroundColor: designSystem.colors.primary },
      ]}
      onPress={() => {
        setIsOpen(false);
      }}
    >
      <AppText style={styles.applyText}>Appliquer les filtres</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
