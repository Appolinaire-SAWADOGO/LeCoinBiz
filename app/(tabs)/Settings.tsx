import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import SettingApplicationSection from "@/components/settings/sections/SettingApplicationSection";
import SettingAppVersionSection from "@/components/settings/sections/SettingAppVersionSection";
import SettingContactSection from "@/components/settings/sections/SettingContactSection";
import SettingHelpSupportSection from "@/components/settings/sections/SettingHelpSupportSection";
import SettingLegalInformationSection from "@/components/settings/sections/SettingLegalInformationSection";
import SettingNavigationSection from "@/components/settings/sections/SettingNavigationSection";
import SettingSecuritySection from "@/components/settings/sections/SettingSecuritySection";
import SettingsLoginSection from "@/components/settings/sections/SettingsLoginSection";
import SettingsLogoutAndDelAcntSection from "@/components/settings/sections/SettingsLogoutOrDelAcntSection";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Settings() {
  const { designSystem } = useAppTheme();

  const currentUser = useCurrentUser();

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

        {/*  Ville de navigation */}
        <SettingNavigationSection />

        {/*  Paramètres de l'application */}
        <SettingApplicationSection />

        {/*  Contact */}
        <SettingContactSection />

        {/*  Aide et support */}
        <SettingHelpSupportSection />

        {/*  Informations légales */}
        <SettingLegalInformationSection />

        {/*  Sécurité */}
        <SettingSecuritySection />

        {/* supprimer ou se deconnecter */}
        {currentUser && <SettingsLogoutAndDelAcntSection />}

        {!currentUser && <SettingsLoginSection />}

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
