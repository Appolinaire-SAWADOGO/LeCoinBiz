import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useSignInWithGoogle = () => {
  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error("ID token manquant");
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(
        signInResult.data?.idToken
      );

      // Sign-in the user with the credential
      const signInWithCredentialResult = await signInWithCredential(
        getAuth(),
        googleCredential
      );

      await firestore()
        .collection("Users")
        .doc(signInWithCredentialResult.user.uid)
        .set({
          userName: signInWithCredentialResult.user.displayName || "",
          firstAndLastName: signInWithCredentialResult.user.displayName || "",
          image: signInWithCredentialResult.user.photoURL || "",
          location: {
            country: "burkina faso",
            city: "ouagadougou",
          },
          phoneNumber: signInWithCredentialResult.user.phoneNumber || "",
          whatsappNumber: signInWithCredentialResult.user.phoneNumber || "",
          email: signInWithCredentialResult.user.email || "",
          authMethod: "GOOGLE",
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.log("Error signing in with Google: ", JSON.stringify(error));
      throw error;
    }
  };

  return { signInWithGoogle };
};
