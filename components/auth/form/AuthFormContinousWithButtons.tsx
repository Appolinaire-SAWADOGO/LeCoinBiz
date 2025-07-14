import AppButton from "@/components/custom/AppButton";
import MailDynSvg from "@/components/svg/MailDynSvg";
import PhoneDynSvg from "@/components/svg/PhoneDynSvg";
import GoogleDynSvg from "@/components/svg/social-media/GoogleDynSvg";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthFormContinousWithButtons({
  useCase,
  types,
}: {
  useCase: "SignIn" | "SignUp";
  types:
    | "signInWithPhomeNumber"
    | "signInWithEmail"
    | "signUpWithPhomeNumber"
    | "signUpWithEmail";
}) {
  const { designSystem } = useAppTheme();

  const buttonsText =
    useCase === "SignIn" ? "Connectez-vous" : "Inscrivez-vous";

  return (
    <View style={styles.continousWithButton}>
      <AppButton
        style={{
          borderWidth: 1,
          borderColor: designSystem.colors.smallText,
          backgroundColor: "transparent",
          elevation: 0,
        }}
        textStyle={{
          fontSize: 14,
          fontWeight: "bold",
          color: designSystem.colors.smallText,
        }}
        title={`${buttonsText} avec Google`}
        Icon={GoogleDynSvg}
      />
      <AppButton
        onPress={() =>
          router.push(
            `/(root)/(auth)/${useCase}?type=${types === `${useCase}WithPhomeNumber` ? `${useCase}WithEmail` : `${useCase}WithPhomeNumber`}`
          )
        }
        style={{
          borderWidth: 1,
          borderColor: designSystem.colors.smallText,
          backgroundColor: "transparent",
          elevation: 0,
          paddingHorizontal: 20,
          gap: types === `${useCase}WithPhomeNumber` ? 10 : 0,
        }}
        textStyle={{
          fontSize: 14,
          fontWeight: "bold",
          color: designSystem.colors.smallText,
        }}
        Icon={types === `${useCase}WithPhomeNumber` ? MailDynSvg : PhoneDynSvg}
        title={
          types === `${useCase}WithPhomeNumber`
            ? `${buttonsText} avec l'email`
            : `${buttonsText} avec le numero de telephone`
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  continousWithButton: {
    gap: 16,
  },
});
