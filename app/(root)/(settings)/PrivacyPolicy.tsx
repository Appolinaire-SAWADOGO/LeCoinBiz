import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const PRIVACY_POLICY_URL =
  "https://appolinaire-sawadogo.github.io/lecoinbiz-privacy-policy";

export default function PrivacyPolicy() {
  const handleContactPress = () => {
    Linking.openURL("mailto:contact.lecoinbiz@gmail.com");
  };

  const handlePrivacyLinkPress = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
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
          1. 📱 Données collectées : nom, adresse e-mail et numéro de téléphone
          (lors de l’inscription ou de la création d’une annonce).
        </AppText>

        <AppText style={styles.text}>
          2. 🔒 Utilisation : ces données sont utilisées uniquement pour le bon
          fonctionnement de l’application (publication d’annonces, contact,
          messagerie).
        </AppText>

        <AppText style={styles.text}>
          3. ❌ Partage : vos données personnelles ne sont jamais vendues et ne
          sont pas partagées avec des tiers sans votre consentement, sauf
          obligation légale ou services techniques nécessaires.
        </AppText>

        <AppText style={styles.text}>
          4. 🔐 Sécurité : nous mettons en place des mesures techniques et
          organisationnelles afin de garantir la sécurité de vos informations.
        </AppText>

        <AppText style={styles.text}>
          5. ⚙️ Gestion des données : vous pouvez à tout moment modifier ou
          supprimer vos données depuis votre profil dans l’application.
        </AppText>

        <AppText style={styles.text}>
          6. 🗑️ Suppression du compte : vous pouvez supprimer complètement votre
          compte et vos données directement depuis les paramètres de
          l’application.
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          Pour toute question concernant la confidentialité ou la protection de
          vos données :
        </AppText>

        <TouchableOpacity onPress={handleContactPress}>
          <AppText style={[styles.text, styles.link]}>
            contact.lecoinbiz@gmail.com
          </AppText>
        </TouchableOpacity>

        <AppText style={[styles.text, { marginTop: 24 }]}>
          La version officielle et à jour de la politique de confidentialité est
          disponible à l’adresse suivante :
        </AppText>

        <TouchableOpacity onPress={handlePrivacyLinkPress}>
          <AppText style={[styles.text, styles.link]}>
            https://appolinaire-sawadogo.github.io/lecoinbiz-privacy-policy
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
