import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppInput from "./AppInput";

export default function AppMobileNumberInput({
  phoneNumber,
  setPhoneNumber,
  editable = true,
}: {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean | undefined;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.mobileNumberInputs}>
      <View
        style={[
          styles.mobileNumber,
          { borderColor: designSystem.colors.inputBorder },
        ]}
      >
        <AppText font="Medium" fontSize={12}>
          +226
        </AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppInput
          editable={editable}
          keyboardType="phone-pad"
          maxLength={8}
          placeholder="xxxxxxxx"
          model="withBorder"
          value={phoneNumber}
          onChangeText={(text) => {
            // Ne garder que les chiffres (bloque les points, virgules, lettres, etc.)
            const digitsOnly = text.replace(/[^0-9]/g, "");
            setPhoneNumber(digitsOnly);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileNumberInputs: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  mobileNumber: {
    width: 70,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
