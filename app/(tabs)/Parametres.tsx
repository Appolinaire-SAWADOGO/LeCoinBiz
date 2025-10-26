import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import SettingApplicationSection from "@/components/settings/sections/SettingApplicationSection";
import SettingAppVersionSection from "@/components/settings/sections/SettingAppVersionSection";
import SettingContactSection from "@/components/settings/sections/SettingContactSection";
import SettingLegalInformationSection from "@/components/settings/sections/SettingLegalInformationSection";
import SettingSecuritySection from "@/components/settings/sections/SettingSecuritySection";
import SettingsLogoutOrdelAcntSection from "@/components/settings/sections/SettingsLogoutOrdelAcntSection";
import { ifUserIsConnected } from "@/functions/firebase-auth";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Parametres() {
  const { designSystem } = useAppTheme();

  return (
    <Container style={styles.container} withBottom={false}>
      <ScrollView style={styles.scrollView}>
        {/* Titre de page */}
        <View>
          <AppText
            font="Bold"
            color={designSystem.colors.bigText}
            fontSize={28}
            style={{ marginBottom: 24 }}
          >
            Paramètres
          </AppText>
        </View>

        {/*  Paramètres de l'application */}
        <SettingApplicationSection />

        {/*  Contact */}
        <SettingContactSection />

        {/*  Informations légales */}
        <SettingLegalInformationSection />

        {/*  Sécurité */}
        <SettingSecuritySection />

        {/* supprimer ou se deconnecter */}
        {ifUserIsConnected() && <SettingsLogoutOrdelAcntSection />}

        {/*  Version de l'app */}
        <SettingAppVersionSection />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
