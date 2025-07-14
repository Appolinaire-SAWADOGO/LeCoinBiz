import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppInput from "@/components/custom/AppInput";
import AppText from "@/components/custom/AppText";
import EditImageSection from "@/components/EditProfile/EditProfileImageSection";
import EditProfileSection from "@/components/EditProfile/EditProfileSection";
import PageHeader from "@/components/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfile() {
  const { designSystem } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Container withBottom>
      <PageHeader
        name="Modifier le profile"
        style={{ paddingHorizontal: 20 }}
      />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 70,
            paddingTop: 24,
            paddingHorizontal: 20,
          }}
        >
          <EditImageSection />
          <EditProfileSection label="Prenom" placeHolder="John" />
          <EditProfileSection label="Nom de famille" placeHolder="Doe" />
          <EditProfileSection label="Email">
            <AppInput placeholder="john.doe@me.com" model="withBorder" />
            <TouchableOpacity>
              <AppText color={designSystem.colors.primary}>
                Vérifier l&lsquo;adresse e-mail
              </AppText>
            </TouchableOpacity>
          </EditProfileSection>
          <EditProfileSection
            label="Numéro de tеlеphone"
            placeHolder="+33 6 00 00 00"
          />
          <EditProfileSection
            label="Changer le mot de passe"
            placeHolder="*********"
          />

          <AppButton title="Enregistrer" style={{ borderRadius: 8 }} />
        </ScrollView>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {},
});
