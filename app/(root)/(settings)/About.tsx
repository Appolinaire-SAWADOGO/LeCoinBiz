import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
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
    <Container>
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
          onPress={() => Linking.openURL("mailto:support@tonapp.com")}
        >
          <AppText
            style={[styles.text, { color: designSystem.colors.primary }]}
          >
            support@tonapp.com
          </AppText>
        </TouchableOpacity>

        <AppText fontSize={12} color="#999" style={{ marginTop: 20 }}>
          Version 1.0.2
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
