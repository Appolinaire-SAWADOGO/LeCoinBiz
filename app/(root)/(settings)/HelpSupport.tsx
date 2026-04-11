import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import { router } from "expo-router";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HelpSupport() {
  return (
    <Container withGoBack>
      <PageHeader name="Aide et support" style={{ paddingHorizontal: 20 }} />

      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Bold" fontSize={20} style={styles.title}>
          Bien commencer sur LeCoinBiz
        </AppText>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            1. Connectez-vous à votre compte
          </AppText>
          <AppText style={styles.text}>
            Rendez-vous dans l'onglet{" "}
            <AppText font="Medium">Paramètres</AppText>, faites défiler jusqu'en
            bas de la page et appuyez sur le bouton
            <AppText font="Medium"> Se connecter</AppText>. Une page s'ouvrira
            alors vous proposant de choisir votre méthode de connexion : par
            e-mail et mot de passe, ou via Google.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            2. Vérifier votre adresse e-mail
          </AppText>

          <AppText font="Medium" style={styles.subTitle}>
            Lors de la création du compte
          </AppText>
          <AppText style={styles.text}>
            Si vous créez un compte par e-mail, après avoir rempli vos
            informations, une page s'affichera vous demandant de vérifier votre
            adresse e-mail. Vous y verrez deux boutons :{" "}
            <AppText font="Medium">Envoyer le lien de vérification</AppText> et{" "}
            <AppText font="Medium">J'ai vérifié</AppText>.
          </AppText>
          <AppText style={styles.text}>
            Commencez par appuyer sur{" "}
            <AppText font="Medium">Envoyer le lien de vérification</AppText>.
            Vous recevrez un e-mail dans votre boîte Gmail. Si vous ne le voyez
            pas, vérifiez votre dossier <AppText font="Medium">Spam</AppText>.
          </AppText>
          <AppText style={styles.text}>
            Cliquez sur le lien reçu : une page s'ouvrira avec un bouton pour
            confirmer votre adresse. Appuyez dessus — la vérification
            s'effectuera directement sur cette page.
          </AppText>
          <AppText style={styles.text}>
            Revenez ensuite sur l'application et appuyez sur{" "}
            <AppText font="Medium">J'ai vérifié</AppText>. Votre compte est
            maintenant activé.
          </AppText>

          <AppText font="Medium" style={styles.subTitle}>
            Depuis la page Profil
          </AppText>
          <AppText style={styles.text}>
            Vous pouvez également vérifier votre adresse e-mail depuis votre
            page <AppText font="Medium">Profil</AppText>. Appuyez sur le bouton{" "}
            <AppText font="Medium">Modifier</AppText> situé en haut à droite,
            puis faites défiler jusqu'en bas de la page de modification et
            appuyez sur{" "}
            <AppText font="Medium">Vérifier mon adresse e-mail</AppText>.
          </AppText>
          <AppText style={styles.text}>
            La page de vérification s'ouvrira automatiquement. Appuyez sur{" "}
            <AppText font="Medium">Envoyer le lien de vérification</AppText>,
            puis consultez votre boîte Gmail — pensez à vérifier le dossier{" "}
            <AppText font="Medium">Spam</AppText> si vous ne trouvez pas
            l'e-mail. Cliquez sur le lien reçu, confirmez votre adresse sur la
            page qui s'affiche, puis revenez sur l'application et appuyez sur{" "}
            <AppText font="Medium">J'ai vérifié</AppText> pour finaliser la
            vérification.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            3. Rechercher une annonce
          </AppText>
          <AppText style={styles.text}>
            Depuis l'accueil, utilisez la recherche et les filtres (categorie,
            ville, prix) pour trouver plus vite ce dont vous avez besoin.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            4. Publier une annonce
          </AppText>

          <AppText style={styles.text}>
            Depuis la page d'accueil, appuyez sur le bouton{" "}
            <AppText font="Medium">Poster une annonce</AppText> situé en bas de
            l'écran. Remplissez ensuite les informations suivantes :
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Titre</AppText> : choisissez un titre clair
            et précis pour votre annonce.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Description</AppText> : une description
            détaillée améliore le référencement de votre produit, mais elle est
            optionnelle.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Prix</AppText> : indiquez un prix clair et
            honnête.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Photos / Vidéo</AppText> : ajoutez jusqu'à 4
            éléments (photos ou vidéo). Vous ne pouvez pas ajouter plus d'une
            vidéo.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Neuf / Livraison gratuite</AppText> : ces
            options sont optionnelles mais aident à mieux référencer votre
            produit.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Ville</AppText> : indiquez votre ville pour
            faciliter la recherche et améliorer le référencement.
          </AppText>

          <AppText style={styles.text}>
            <AppText font="Medium">Numéro de téléphone / WhatsApp</AppText> :
            renseignez vos coordonnées pour permettre aux acheteurs de vous
            contacter facilement.
          </AppText>

          <TouchableOpacity
            onPress={() => router.navigate("/(root)/(settings)/PostingRules")}
          >
            <AppText style={styles.link}>Voir les règles de diffusion</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            4. Contacter un vendeur
          </AppText>

          <AppText style={styles.text}>
            Appuyez sur le produit qui vous intéresse pour accéder à sa page de
            détails. En bas de cette page, vous trouverez trois boutons :{" "}
            <AppText font="Medium">WhatsApp</AppText>,{" "}
            <AppText font="Medium">Appeler</AppText> et{" "}
            <AppText font="Medium">SMS</AppText>. Choisissez simplement l'option
            qui vous convient le mieux pour contacter le vendeur directement.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            6. Modifier une annonce
          </AppText>
          <AppText style={styles.text}>
            Rendez-vous sur votre page <AppText font="Medium">Profil</AppText>,
            appuyez sur le produit concerné pour accéder à sa page de détails.
            En bas de cette page, appuyez sur le bouton{" "}
            <AppText font="Medium">Modifier</AppText> — vous serez redirigé vers
            la page de modification où vous pourrez effectuer vos changements,
            puis appuyer sur <AppText font="Medium">Modifier</AppText> pour
            valider.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            7. Désactiver une annonce
          </AppText>
          <AppText style={styles.text}>
            Depuis votre page <AppText font="Medium">Profil</AppText>, dans la
            section <AppText font="Medium">En vente</AppText>, appuyez sur le
            produit concerné. Sur la page de détails, appuyez sur le bouton{" "}
            <AppText font="Medium">Désactiver</AppText> pour retirer l'annonce
            de la liste.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            8. Réactiver une annonce désactivée
          </AppText>
          <AppText style={styles.text}>
            Depuis votre page <AppText font="Medium">Profil</AppText>, dans la
            section <AppText font="Medium">Désactivées</AppText>, appuyez sur le
            produit concerné. Sur la page de détails, appuyez sur le bouton{" "}
            <AppText font="Medium">Activer</AppText> pour remettre l'annonce en
            ligne.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            9. Modifier son profil
          </AppText>
          <AppText style={styles.text}>
            Depuis votre page <AppText font="Medium">Profil</AppText>, appuyez
            sur le bouton <AppText font="Medium">Modifier</AppText> situé en
            haut à droite. Vous serez redirigé vers la page de modification où
            vous pourrez mettre à jour vos informations.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            10. Modifier son mot de passe
          </AppText>
          <AppText style={styles.text}>
            Depuis votre page <AppText font="Medium">Profil</AppText>, appuyez
            sur le bouton <AppText font="Medium">Modifier</AppText> situé en
            haut à droite. Sur la page de modification, faites défiler jusqu'en
            bas et appuyez sur le bouton{" "}
            <AppText font="Medium">Changer mon mot de passe</AppText>.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            11. Se déconnecter
          </AppText>
          <AppText style={styles.text}>
            Rendez-vous dans l'onglet{" "}
            <AppText font="Medium">Paramètres</AppText>, faites défiler jusqu'en
            bas de la page et appuyez sur le bouton{" "}
            <AppText font="Medium">Se déconnecter</AppText>.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            12. Supprimer son compte
          </AppText>
          <AppText style={styles.text}>
            Rendez-vous dans l'onglet{" "}
            <AppText font="Medium">Paramètres</AppText>, faites défiler jusqu'en
            bas de la page et appuyez sur le bouton{" "}
            <AppText font="Medium">Supprimer mon compte</AppText>.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            13. Signaler une annonce
          </AppText>
          <AppText style={styles.text}>
            Sur la page de détails du produit concerné, faites défiler vers le
            bas et appuyez sur le bouton{" "}
            <AppText font="Medium">Signaler cette annonce</AppText>.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            14. Ajouter un produit aux favoris
          </AppText>
          <AppText style={styles.text}>
            Appuyez sur l'icône <AppText font="Medium">♡</AppText> du produit
            concerné pour ajouter le produit à vos favoris.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            15. Retirer un produit des favoris
          </AppText>
          <AppText style={styles.text}>
            Depuis la page <AppText font="Medium">Favoris</AppText>, appuyez sur
            l'icône <AppText font="Medium">♡</AppText> du produit concerné pour
            le retirer de vos favoris.
          </AppText>
        </View>

        <View style={styles.block}>
          <AppText font="Medium" style={styles.stepTitle}>
            16. Echanger en securite
          </AppText>
          <AppText style={styles.text}>
            Echangez dans un lieu public, ne payez jamais avant verification et
            signalez tout comportement suspect.
          </AppText>
          <TouchableOpacity
            onPress={() => router.navigate("/(root)/(settings)/SecurityTips")}
          >
            <AppText style={styles.link}>Lire les conseils de securite</AppText>
          </TouchableOpacity>
        </View>

        <View style={[styles.block, { marginBottom: 8 }]}>
          <AppText font="Medium" style={styles.stepTitle}>
            Besoin d'aide supplementaire ?
          </AppText>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("mailto:contact.lecoinbiz@gmail.com").catch(
                (err) => {
                  console.error(
                    "Erreur lors de l'ouverture du client mail : ",
                    err,
                  );
                },
              )
            }
          >
            <AppText style={styles.link}>contact.lecoinbiz@gmail.com</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://wa.me/22677976643").catch((err) => {
                console.error(
                  "WhatsApp n'est pas installe sur ce telephone : ",
                  err,
                );
              })
            }
          >
            <AppText style={styles.link}>Contacter sur WhatsApp</AppText>
          </TouchableOpacity>
        </View>
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
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  block: {
    gap: 8,
    marginTop: 8,
  },
  stepTitle: {
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  link: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
