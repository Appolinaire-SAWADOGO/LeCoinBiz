import { isValidEmail } from "@/functions/auth-form";
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
  actionError?: string;
}) {
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setError("Champ requis");
    } else if (!isValidEmail(value)) {
      setError("Email invalide");
    } else {
      setError("");
    }

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
        style={[error ? { borderColor: "red" } : { borderColor: "#ccc" }]}
      />
      {(error || actionError) && (
        <AppText style={styles.error}>{error || actionError}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
});
