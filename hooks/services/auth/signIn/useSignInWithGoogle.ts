import { useAuthModalStore } from "@/store/useAuthModalStore";
import { showToast } from "@/utils";
import { subscribeToUserTopic } from "@/utils/notifications";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAdsByUserId } from "../../ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "../../ads/useGetUserAdsCount";
import { useGetFavoriteAdsByUserId } from "../../favorites/useGetFavoritesAdsByUserId";
import { useGetUserById } from "../../user/useGetUserById";

export const useSignInWithGoogle = () => {
  const { onClose } = useAuthModalStore();
  const queryClient = useQueryClient();
  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();

  const signInWithGoogle = async () => {
    try {
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
        return;
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
