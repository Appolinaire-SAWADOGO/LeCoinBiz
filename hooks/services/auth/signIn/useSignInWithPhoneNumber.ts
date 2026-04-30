import { useAddUsernameModalStore } from "@/store/useAddUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { ContinousWithPhomeNumberStepType } from "@/types";
import { showToast } from "@/utils";
import { subscribeToUserTopic } from "@/utils/notifications";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useGetAdsByUserId } from "../../ads/useGetAdsByUserId";
import { useGetUserAdsCount } from "../../ads/useGetUserAdsCount";
import { useGetFavoriteAdsByUserId } from "../../favorites/useGetFavoritesAdsByUserId";
import { useGetUserById } from "../../user/useGetUserById";
import { useCreateUserWithPhone } from "../SignUp/useCreateUserWithPhone";

export function useSignInWithPhoneNumber(
  setStep: React.Dispatch<
    React.SetStateAction<ContinousWithPhomeNumberStepType>
  >,
  phoneNumber: string,
) {
  const queryClient = useQueryClient();
  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();

  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { onClose: closeAuthModal } = useAuthModalStore();
  const { onOpen: openAddUsernameModal } = useAddUsernameModalStore();

  const { createUserWithPhone } = useCreateUserWithPhone(phoneNumber);

  const [error, setError] = useState<{
    enterPhoneNumber: string | null;
    enterOTP: string | null;
    addUserName: string | null;
  }>({
    enterPhoneNumber: null,
    enterOTP: null,
    addUserName: null,
  });

  const handleSetError = (
    step: ContinousWithPhomeNumberStepType,
    message: string | null,
  ) => {
    setError((prev) => ({
      ...prev,
      [step]: message,
    }));
  };

  // Handle login
  function handleAuthStateChanged(user: any) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function handleSignInWithPhoneNumber() {
    if (!phoneNumber) return null;

    try {
      setIsLoading(true);

      console.log("trying with", phoneNumber);

      // const testPhoneNumber = `+1 650-555-3434`;

      const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);

      setConfirm(confirmation);

      handleSetError("enterPhoneNumber", null);

      setStep("enterOTP");
    } catch (error) {
      handleSetError(
        "enterPhoneNumber",
        "Une erreur est survenue, veuillez réessayer.",
      );
      console.log("Erreur pendant signInWithPhoneNumber:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmCode() {
    try {
      setIsLoading(true);

      const userCredential = await confirm?.confirm(code);

      setConfirm(null);

      const userUuid = userCredential?.user?.uid;

      await subscribeToUserTopic(userUuid!);

      if (userCredential?.additionalUserInfo?.isNewUser) {
        await createUserWithPhone(userUuid!);

        closeAuthModal();
        openAddUsernameModal();
      } else {
        if (userCredential?.user.displayName) {
          handleSetError("enterOTP", null);

          closeAuthModal();

          showToast("success", "Connexion réussie !", 100);
        } else {
          handleSetError("enterOTP", null);

          closeAuthModal();
          openAddUsernameModal();
        }
      }
    } catch (error) {
      handleSetError(
        "enterOTP",
        "Le code entré est invalide, veuillez réessayer.",
      );
      console.log("Invalid code.", error);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    handleSignInWithPhoneNumber,
    confirmCode,
    code,
    setCode,
    isLoading,
    error,
  };
}
