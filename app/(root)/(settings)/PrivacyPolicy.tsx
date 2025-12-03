import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function PrivacyPolicy() {
  const handleContactPress = () => {
    Linking.openURL("mailto:support@tonapp.com");
  };

  return (
    <Container withGoBack>
      <PageHeader
        name="Politique de confidentialité"
        style={{ paddingHorizontal: 20 }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Bold" fontSize={20} style={styles.title}>
          Protection de vos données
        </AppText>

        <AppText style={styles.text}>
          Nous accordons une grande importance à la confidentialité de vos
          données personnelles. Voici ce que nous collectons et comment nous les
          utilisons :
        </AppText>

        <AppText style={styles.text}>
          1. 📱 Données collectées : nom, e-mail, numéro de téléphone (lors de
          la création d’annonce ou inscription).
        </AppText>
        <AppText style={styles.text}>
          2. 🔒 Utilisation : ces données sont utilisées uniquement pour le bon
          fonctionnement de l’application (publication, contact, messagerie).
        </AppText>
        <AppText style={styles.text}>
          3. ❌ Partage : vos données ne sont jamais vendues ni partagées à des
          tiers sans votre consentement.
        </AppText>
        <AppText style={styles.text}>
          4. 🔐 Sécurité : nous mettons en place des mesures de protection pour
          garantir la sécurité de vos informations.
        </AppText>
        <AppText style={styles.text}>
          5. ⚙️ Vous pouvez à tout moment modifier ou supprimer vos données
          depuis votre profil.
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          Pour toute question sur la confidentialité ou la protection de vos
          données :
        </AppText>
        <TouchableOpacity onPress={handleContactPress}>
          <AppText style={[styles.text, styles.link]}>
            support@tonapp.com
          </AppText>
        </TouchableOpacity>
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
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
