import AppButton from "@/components/custom/AppButton";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthFormContinousButtons({
  onclickContinousButton,
  continousButtonDisabled,
  isLoading = false,
}: {
  onclickContinousButton?: () => void;
  continousButtonDisabled: boolean;
  isLoading?: boolean;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.continousbutton}>
      <AppButton
        isLoading={isLoading}
        title="Continuer"
        textStyle={{ fontSize: 14, fontWeight: "bold" }}
        onPress={() => onclickContinousButton?.()}
        disabled={continousButtonDisabled}
        style={{
          backgroundColor: continousButtonDisabled
            ? designSystem.colors.primaryDisabled
            : designSystem.colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  continousbutton: {
    gap: 0,
  },
});
