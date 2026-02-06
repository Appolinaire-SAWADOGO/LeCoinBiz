import AppText from "@/components/custom/AppText";
import InfoDynSvg from "@/components/svg/InfoDynSvg";
import { APP_NAME } from "@/constants";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthFormLegalCard() {
  return (
    <View style={styles.infoSection}>
      <InfoDynSvg />
      <AppText fontSize={12} style={{ lineHeight: 16 }}>
        En sélectionnant Suivant, j&apos;accepte{" "}
        <Link style={styles.link} href="/(root)/(settings)/TermsOfUs">
          {" "}
          les Conditions Générales d&apos;Utilisation
        </Link>{" "}
        ,
        <Link style={styles.link} href="/(root)/(settings)/PrivacyPolicy">
          {" "}
          la Politique de Confidentialité
        </Link>{" "}
        et
        <Link style={styles.link} href="/(root)/(settings)/PostingRules">
          {" "}
          les Règles de Diffusion
        </Link>{" "}
        de {APP_NAME}.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  infoSection: {
    width: "100%",
    backgroundColor: "#DEE0E4",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
