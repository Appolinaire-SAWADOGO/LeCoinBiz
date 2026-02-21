import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function SecurityTips() {
  const handleContactPress = () => {
    Linking.openURL("mailto:contact.lecoinbiz@gmail.com");
  };

  return (
    <Container withGoBack>
      <PageHeader
        name="Conseils de sécurité"
        style={{ paddingHorizontal: 20 }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Bold" fontSize={20} style={styles.title}>
          Achetez et vendez en toute sécurité
        </AppText>

        <AppText style={styles.text}>
          Voici quelques conseils pour assurer votre sécurité lors de vos
          échanges sur la plateforme :
        </AppText>

        <AppText style={styles.text}>
          1. Privilégiez les rencontres en personne, dans un lieu public et
          sécurisé.
        </AppText>
        <AppText style={styles.text}>
          2. N’envoyez jamais d’argent avant d’avoir vu le produit.
        </AppText>
        <AppText style={styles.text}>
          3. Vérifiez l’identité du vendeur ou de l’acheteur avant de finaliser
          la transaction.
        </AppText>
        <AppText style={styles.text}>
          4. Signalez tout comportement suspect ou annonce douteuse.
        </AppText>
        <AppText style={styles.text}>
          5. Ne communiquez pas d’informations sensibles (code bancaire, pièce
          d’identité…).
        </AppText>

        <AppText style={[styles.text, { marginTop: 20 }]}>
          En cas de doute ou d’arnaque, contactez notre équipe :
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
