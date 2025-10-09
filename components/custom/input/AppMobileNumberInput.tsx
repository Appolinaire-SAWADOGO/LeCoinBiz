import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import AppInput from "./AppInput";

export default function AppMobileNumberInput({
  phoneNumber,
  setPhoneNumber,
  editable = true,
  onChange,
  style,
  leftStyle,
}: {
  phoneNumber?: string;
  setPhoneNumber?: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean | undefined;
  onChange?: (text: string) => void;
  style?: StyleProp<TextStyle>;
  leftStyle?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.mobileNumberInputs}>
      <View
        style={[
          styles.mobileNumber,
          { borderColor: designSystem.colors.inputBorder },
          leftStyle,
        ]}
      >
        <AppText font="Medium" fontSize={12}>
          +226
        </AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppInput
          editable={editable}
          keyboardType="numeric"
          maxLength={8}
          placeholder="xxxxxxxx"
          model="withBorder"
          value={phoneNumber}
          onChangeText={(text) => {
            // Ne garder que les chiffres (bloque les points, virgules, lettres, etc.)
            const digitsOnly = text.replace(/[^0-9]/g, "");
            setPhoneNumber?.(digitsOnly);
            onChange?.(digitsOnly);
          }}
          style={style}
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
