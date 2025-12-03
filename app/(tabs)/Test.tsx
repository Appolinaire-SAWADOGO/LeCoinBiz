import Container from "@/components/Container";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { Button } from "react-native";

GoogleSignin.configure({
  webClientId:
    "641604581560-ege8p5dejjrpq5327staqvr8te49rr1p.apps.googleusercontent.com",
});

export default function Test() {
  async function onGoogleButtonPress() {
    try {
      console.log(1);

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log(2);

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      console.log(3);

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;

      console.log("IdToken", idToken);

      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }

      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      console.log("signed with google !");

      // Sign-in the user with the credential
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      console.log(
        "Error l'ors de la connexion: ",
        JSON.stringify(error, null, 2)
      );
    }
  }

  return (
    <Container>
      <Button
        title="Google Sign-In"
        onPress={async () => await onGoogleButtonPress()}
      />
    </Container>
  );
}
