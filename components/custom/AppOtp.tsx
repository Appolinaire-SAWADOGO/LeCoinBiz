import React, { useRef } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

export default function AppOtp({
  code,
  setCode,
  onEnter,
}: {
  code: string;
  setCode: (value: string) => void;
  onEnter?: () => Promise<void>;
}) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = code.split("");
    // Toujours prendre le dernier chiffre tapé
    const char = text.replace(/[^0-9]/g, "").slice(-1) || "";
    newCode[index] = char;
    setCode(newCode.join(""));

    // Aller au champ suivant uniquement si un chiffre a été tapé
    if (char && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    console.log("e.nativeEvent.key", e.nativeEvent.key);

    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      const newCode = code.split("");
      newCode[index - 1] = "";
      setCode(newCode.join(""));
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            inputs.current[i] = el; // ✅ on stocke
            /* rien à retourner → fonction de type void */
          }}
          value={code[i] || ""}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          style={[styles.input, { borderColor: "#ccc" }]}
          textAlign="center"
          returnKeyType="done" // Cela affiche un bouton "Valider"
          blurOnSubmit={false}
          onSubmitEditing={async () => {
            if (i === 5 && code.length === 6) {
              Keyboard.dismiss();
              await onEnter?.(); // ✅ L'utilisateur a validé le champ 6
            }
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 22,
    fontWeight: "600",
    backgroundColor: "#fff",
  },
});
