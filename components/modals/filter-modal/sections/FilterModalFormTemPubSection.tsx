import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function FilterModalFormTemPubSection({
  temPub,
  setTemPub,
}: {
  temPub: string;
  setTemPub: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <>
      <AppText style={styles.label}>Temps de publication</AppText>
      <View style={styles.timeFilterContainer}>
        {[
          "Toutes les annonces",
          "Aujourd’hui",
          "Moins de 3 jours",
          "Moins de 7 jours",
        ].map((label, id) => {
          const isSelected = temPub === label;

          return (
            <TouchableOpacity
              key={id}
              onPress={() => setTemPub!(label)}
              style={[
                styles.timeButton,
                {
                  backgroundColor: isSelected
                    ? designSystem.colors.primaryLight
                    : "#fff",
                  borderColor: isSelected
                    ? designSystem.colors.primary
                    : designSystem.colors.inputBorder,
                },
              ]}
            >
              <AppText
                style={[
                  styles.timeButtonText,
                  isSelected && {
                    color: designSystem.colors.primary,
                    fontWeight: "bold",
                  },
                ]}
              >
                {label}
              </AppText>
            </TouchableOpacity>
          );
        })}
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
  timeFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "#f0f0f0",
  },
  timeButtonText: {
    fontSize: 13,
    color: "#333",
  },
});
