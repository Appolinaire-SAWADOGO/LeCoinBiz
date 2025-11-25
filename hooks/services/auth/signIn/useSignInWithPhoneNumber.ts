import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ContinousWithPhomeNumberStepType } from "@/types";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { checkIfUserNameIsAdded } from "../../../../functions/auth";
import { useCreateUserWithPhone } from "../SignUp/useCreateUserWithPhone";

export function useSignInWithPhoneNumber(
  setStep: React.Dispatch<
    React.SetStateAction<ContinousWithPhomeNumberStepType>
  >,
  phoneNumber: string
) {
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const [code, setCode] = useState("123456");

  const [isLoading, setIsLoading] = useState(false);

  const { setUserIsLogged, setUserNameIsAdded } = useAuthStore();
  const { onClose } = useAuthModalStore();

  const { createUserWithPhone } = useCreateUserWithPhone(phoneNumber);

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
    if (!phoneNumber) return;

    try {
      setIsLoading(true);

      console.log("trying with", phoneNumber);

      const testPhoneNumber = `+1 650-555-3434`;

      const confirmation = await signInWithPhoneNumber(
        getAuth(),
        testPhoneNumber
      );

      console.log(
        "Confirmation result:",
        JSON.stringify(confirmation, null, 2)
      );

      setConfirm(confirmation);

      setStep("enterOTP");
    } catch (error) {
      console.log("Erreur brute pendant signInWithPhoneNumber:", error);
      console.log(
        "Erreur formatée pendant signInWithPhoneNumber:",
        JSON.stringify(error, null, 2)
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmCode() {
    try {
      setIsLoading(true);

      console.log("confirming with", code);

      const userCredential = await confirm?.confirm(code);

      console.log(
        "Utilisateur connecté :",
        JSON.stringify(userCredential, null, 2)
      );

      setUserIsLogged(true);
      setConfirm(null);

      const userUuid = userCredential?.user?.uid;

      if (userCredential?.additionalUserInfo?.isNewUser) {
        console.log("isNewUser", userCredential?.additionalUserInfo?.isNewUser);

        await createUserWithPhone(userUuid!);
        setStep("addUserName");
      } else {
        console.log("NoNewUser", userCredential?.additionalUserInfo?.isNewUser);

        const userNameIsAdded = await checkIfUserNameIsAdded(userUuid!);
        console.log("userNameIsAdded", userNameIsAdded);

        if (userNameIsAdded) {
          setUserNameIsAdded(true);
          onClose();
        } else {
          setStep("addUserName");
        }
      }
    } catch (error) {
      console.log("Invalid code.", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }
  return { handleSignInWithPhoneNumber, confirmCode, code, setCode, isLoading };
}
