import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import { APP_VERION } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function About() {
  const { designSystem } = useAppTheme();

  return (
    <Container withGoBack>
      <PageHeader name="À propos de nous" style={{ paddingHorizontal: 20 }} />

      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Medium" style={styles.sectionTitle}>
          Notre application
        </AppText>
        <AppText fontSize={14} style={styles.text}>
          Notre application permet aux utilisateurs de poster, rechercher des
          annonces locales facilement.
        </AppText>

        <AppText font="Medium" style={styles.sectionTitle}>
          Notre mission
        </AppText>
        <AppText style={styles.text}>
          Créer une plateforme simple, rapide et accessible à toute la
          communauté pour vendre et acheter des produits localement.
        </AppText>

        <AppText font="Medium" style={styles.sectionTitle}>
          Contact
        </AppText>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:contact.lecoinbiz@gmail.com")}
        >
          <AppText
            style={[styles.text, { color: designSystem.colors.primary }]}
          >
            contact.lecoinbiz@gmail.com
          </AppText>
        </TouchableOpacity>

        <AppText fontSize={12} color="#999" style={{ marginTop: 20 }}>
          Version {APP_VERION}
        </AppText>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
