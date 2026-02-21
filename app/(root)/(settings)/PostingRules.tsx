import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function PostingRules() {
  const handleContactPress = () => {
    Linking.openURL("mailto:contact.lecoinbiz@gmail.com");
  };

  return (
    <Container withGoBack>
      <PageHeader
        name="Règles de diffusion"
        style={{ paddingHorizontal: 20 }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Bold" fontSize={20} style={styles.title}>
          Bonnes pratiques pour publier une annonce
        </AppText>

        <AppText style={styles.text}>
          Afin de garantir la qualité des annonces sur notre plateforme, nous
          demandons à tous les utilisateurs de respecter les règles suivantes :
        </AppText>

        <AppText style={styles.text}>
          1. L’annonce doit être claire, précise et liée à un produit ou service
          réel.
        </AppText>
        <AppText style={styles.text}>
          2. Il est interdit de publier des contenus offensants, illégaux ou
          violant les droits d’autrui.
        </AppText>
        <AppText style={styles.text}>
          3. Ajoutez des photos fidèles et non floutées du produit (pas d’images
          génériques ou trompeuses).
        </AppText>
        <AppText style={styles.text}>
          4. Le prix indiqué doit être cohérent avec le produit proposé.
        </AppText>
        <AppText style={styles.text}>
          5. Ne publiez pas la même annonce plusieurs fois (pas de doublons).
        </AppText>
        <AppText style={styles.text}>
          6. Les annonces doivent être postées uniquement dans la bonne
          catégorie et ville.
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          En cas de non-respect de ces règles, votre annonce pourra être mise en
          attente pour vérification.
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          Pour toute question ou signalement :
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
