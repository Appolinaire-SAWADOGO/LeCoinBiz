import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function TermsOfUse() {
  const handleContactPress = () => {
    Linking.openURL("mailto:contact.lecoinbiz@gmail.com");
  };

  return (
    <Container withGoBack>
      <PageHeader
        name="Conditions Générales d'Utilisation"
        style={{ paddingHorizontal: 20 }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Bold" fontSize={20} style={styles.title}>
          Conditions d&lsquo;utilisation
        </AppText>

        <AppText style={styles.text}>
          En utilisant cette application, vous acceptez les règles suivantes :
        </AppText>

        <AppText style={styles.text}>
          1. Respectez les autres utilisateurs.
        </AppText>
        <AppText style={styles.text}>
          2. Ne publiez pas de contenu illégal, offensant ou trompeur.
        </AppText>
        <AppText style={styles.text}>
          3. Les annonces doivent respecter les lois en vigueur dans votre pays.
        </AppText>
        <AppText style={styles.text}>
          4. Nous ne sommes pas responsables des échanges ou transactions entre
          utilisateurs.
        </AppText>
        <AppText style={styles.text}>
          5. En cas de comportement abusif, votre compte pourra être suspendu.
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          Pour toute question ou signalement, contactez-nous à :
        </AppText>
        <TouchableOpacity onPress={handleContactPress}>
          <AppText style={[styles.text, styles.link]}>
            contact.lecoinbiz@gmail.com
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
