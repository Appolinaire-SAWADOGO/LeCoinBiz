import { useAuthModalStore } from "@/store/useAuthModalStore";
import { getUserCity, showToast } from "@/utils";
import { firebaseFunctions } from "@/utils/firebase";
import { subscribeToUserTopic } from "@/utils/notifications";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useSignInWithGoogle = () => {
  const { onClose } = useAuthModalStore();

  const signInWithGoogle = async () => {
    const userCity = await getUserCity();

    try {
      await GoogleSignin.signOut();

      let idToken;

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      idToken = signInResult.data?.idToken;

      if (!idToken) {
        console.log("signInResult : ", JSON.stringify(signInResult, null, 2));

        return null;
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(
        signInResult.data?.idToken,
      );

      // Sign-in the user with the credential
      const signInWithCredentialResult = await signInWithCredential(
        getAuth(),
        googleCredential,
      );

      if (signInWithCredentialResult.additionalUserInfo?.isNewUser) {
        const createUser = firebaseFunctions.httpsCallable(
          "createUserWithGoogle",
        );

        await createUser({
          userName: signInWithCredentialResult.user.displayName || "",
          firstAndLastName: signInWithCredentialResult.user.displayName || "",
          image: signInWithCredentialResult.user.photoURL || "",
          phoneNumber: signInWithCredentialResult.user.phoneNumber || "",
          whatsappNumber: signInWithCredentialResult.user.phoneNumber || "",
          email: signInWithCredentialResult.user.email || "",
          city: userCity || "ouagadougou",
        });
      }

      await subscribeToUserTopic(signInWithCredentialResult.user.uid);

      onClose();

      showToast("success", "Connexion réussie !", 100);
    } catch (error) {
      console.log("Error signing in with Google: ", error);
      throw error;
    }
  };

  return { signInWithGoogle };
};
