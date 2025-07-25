import PasswordInputCheckCard from "@/components/auth/form/PassordInpuCheckCard"; // Vérifie le nom réel du fichier
import AppText from "@/components/custom/AppText";
import { isValidPassword } from "@/functions/auth-form";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppPasswordInput({
  value = "",
  placeholder,
  style,
  onChangeText,
  editable = true,
}: {
  value?: string;
  placeholder: string;
  style?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}) {
  const { designSystem } = useAppTheme();
  const [isVisible, setIsVisible] = React.useState(false);

  const seeButtonTextColor = isVisible
    ? designSystem.colors.smallText
    : designSystem.colors.subText;

  // Conditions dynamiques
  const { hasLetter, hasNumber, hasSpecial, hasMinLength, hasMaxLength } =
    isValidPassword(value);

  return (
    <View>
      {/* input container */}
      <View style={styles.head}>
        <TextInput
          editable={editable}
          maxLength={20}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
          placeholder={placeholder}
          style={[
            styles.input,
            { borderColor: designSystem.colors.inputBorder },
            style,
          ]}
        />

        {/* toggle visibility */}
        {editable && (
          <TouchableOpacity
            onPress={() => setIsVisible((prev) => !prev)}
            style={styles.seeButton}
          >
            <AppText color={seeButtonTextColor} fontSize={13} font="Medium">
              {isVisible ? "Cacher" : "Voir"}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* password conditions */}
      {editable && (
        <View style={styles.condition}>
          <AppText color={designSystem.colors.subText}>
            Votre mot de passe doit contenir au moins :
          </AppText>
          <PasswordInputCheckCard
            isvalided={hasLetter}
            label="Une lettre (a-z)"
          />
          <PasswordInputCheckCard
            isvalided={hasNumber}
            label="Un chiffre (0-9)"
          />
          <PasswordInputCheckCard
            isvalided={hasSpecial}
            label="Un caractère spécial"
          />
          <PasswordInputCheckCard
            isvalided={hasMinLength}
            label="8 caractères minimum"
          />
          <PasswordInputCheckCard
            isvalided={hasMaxLength}
            label="20 caractères maximum"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    height: 48,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    fontFamily: "BasisGrotesqueArabicPro-Regular",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    paddingLeft: 16,
    paddingRight: 60,
  },
  condition: {
    marginTop: 8,
    gap: 4,
  },
  seeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});
