import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AuthPagesInputSection from "@/components/auth/form/AuthFormInputSection";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import InfoDynSvg from "@/components/svg/InfoDynSvg";
import { appName } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

type SignUpType = "signUpWithPhomeNumber" | "signUpWithPhomeNumber";

export default function SignUpForm() {
  const { designSystem } = useAppTheme();

  const params = useLocalSearchParams();
  const types = params.type as SignUpType;

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
          Inscrivez-vous à {appName}
        </AppText>

        <View style={styles.inputsSection}>
          {/* first name */}
          <AuthPagesInputSection
            label="Prénom"
            placeholder="John"
            type="text"
          />

          {/* last name*/}
          <AuthPagesInputSection
            label="Nom de famille"
            placeholder="Doe"
            type="text"
          />

          {/* mobile number section  */}
          <AuthPagesInputSection
            label="Numero de telephone"
            type="mobile number"
          />

          {/* password section  */}
          <AuthPagesInputSection label="Mot de passe" type="password" />
        </View>

        <View style={styles.infoSection}>
          <InfoDynSvg />
          <AppText fontSize={12}>
            En sélectionnant Suivant, j&apos;accepte les conditions de service,
            les conditions de paiement et la politique de confidentialité de{" "}
            {appName}.
          </AppText>
        </View>

        <AppButton
          title="Suivant"
          textStyle={{ fontSize: 14, fontWeight: "bold" }}
          style={{ marginBottom: 20 }}
        />
      </View>
    </AuthPagesContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 24,
  },
  infoSection: {
    height: 62,
    width: "100%",
    backgroundColor: "#DEE0E4",
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  inputsSection: {
    gap: 20,
    marginBottom: 20,
  },
});
