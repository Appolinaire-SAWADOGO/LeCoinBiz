import { isValidEmail } from "@/utils/auth";
import { validateEmail } from "@/utils/auth/validation";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import AppInput from "./AppInput";

export default function AppEmailInput({
  email,
  setEmail,
  editable = true,
  placeholder,
  value,
  onChangeText,
  actionError,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean | undefined;
  placeholder?: string;
  value?: string;
  onChangeText?: ((text: string) => void) | undefined;
  actionError?: string | null;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setEmail(value);

    if (!validateEmail(value).isValid)
      setError(validateEmail(value).error as string);
    else setError(null);

    if (onChangeText) {
      onChangeText(value);
    }
  };

  return (
    <View>
      <AppInput
        editable={editable}
        placeholder={placeholder || "exemple@domaine.com"}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={handleChange}
        model="withBorder"
        maxLength={150}
        style={[error ? { borderColor: "red" } : { borderColor: "#ccc" }]}
      />
      {(error || actionError) && !isValidEmail(value as string) && (
        <AppText style={styles.error}>{error || actionError}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginTop: 8,
    fontSize: 13,
  },
});
