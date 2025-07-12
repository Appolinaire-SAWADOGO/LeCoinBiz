import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import { appName } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import AuthFormContinousWithButtons from "./AuthFormContinousWithButtons";
import AuthFormInfoCard from "./AuthFormInfoCard";
import AuthFormInputSection from "./AuthFormInputSection";
import Orcard from "./Orcard";

type ParamsType =
  | "signInWithPhomeNumber"
  | "signInWithEmail"
  | "signUpWithPhomeNumber"
  | "signUpWithEmail";

export default function AuthPagesContent({
  useCase,
}: {
  useCase: "SignIn" | "SignUp";
}) {
  const { designSystem } = useAppTheme();

  const params = useLocalSearchParams();
  const types = params.type as ParamsType;

  return (
    <AuthPagesContainer>
      <View style={styles.main}>
        {/* page name */}
        <AppText
          fontSize={28}
          font="Bold"
          color={designSystem.colors.bigText}
          style={{ marginBottom: 32 }}
        >
          {useCase === "SignIn"
            ? `Connectez-vous à votre compte`
            : `Inscrivez-vous à ${appName}`}
        </AppText>

        {/* input  */}
        <View style={styles.inputsSection}>
          {/* Email adress  */}
          <AuthFormInputSection
            placeholder={
              types === `${useCase}WithPhomeNumber` ? "" : "exemple@gmail.com"
            }
            label={
              types === `${useCase}WithPhomeNumber`
                ? "Votre numero de telephone"
                : "Votre adresse email"
            }
            type={
              types === `${useCase}WithPhomeNumber` ? "mobile number" : "text"
            }
          />
        </View>

        {/* <AppInput
          placeholder={"exemple@gmail.com"}
          model="withBorder"
          style={{ backgroundColor: "red" }}
        /> */}

        {/* <TextInput
          placeholder={"exemple@gmail.com"}
          style={{ backgroundColor: "red" }}
        /> */}

        {/* info card */}
        {types === `${useCase}WithPhomeNumber` && (
          <AuthFormInfoCard label=" Vous recevrez un code OTP de Skillr pour confirmer votre numéro." />
        )}

        {/* continous */}
        <View style={styles.continousbutton}>
          {/* continue button */}
          <AppButton
            title="Continuer"
            textStyle={{ fontSize: 14, fontWeight: "bold" }}
          />
        </View>

        {/* or  */}
        <Orcard />

        {/* continous with button */}
        <AuthFormContinousWithButtons useCase={useCase} types={types} />
      </View>
    </AuthPagesContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 24,
  },

  inputsSection: {
    marginBottom: 24,
  },

  continousbutton: {
    gap: 20,
  },
});
