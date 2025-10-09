import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AuthFormInfoCard from "@/components/auth/form/AuthFormInfoCard";
import AuthFormInputSection from "@/components/auth/form/AuthFormInputSection";
import AuthFormOtpCheck from "@/components/auth/form/AuthFormOtpCheck";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import { useSignInWithPhoneNumber } from "@/hooks/services/auth/signIn/useSignInWithPhoneNumber";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AuthModalType, ContinousWithPhomeNumberStepType } from "@/types";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import AuthAddUserNameContent from "../AuthAddUserNameContent";
import {APP_NAME} from "@/constants";

export default function ContinousWithPhoneNumber({
  setBigStep,
}: {
  setBigStep: React.Dispatch<React.SetStateAction<AuthModalType>>;
}) {
  const { designSystem } = useAppTheme();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [step, setStep] =
    React.useState<ContinousWithPhomeNumberStepType>("enterPhoneNumber");

  const phoneNumberWithCountryCode = `+226${phoneNumber}`;

  const { handleSignInWithPhoneNumber, confirmCode, code, setCode, isLoading } =
    useSignInWithPhoneNumber(setStep, phoneNumberWithCountryCode);

  const ifContinousButtonDisabled = () => {
    if (step === "enterPhoneNumber" && phoneNumber.length === 8 && !isLoading)
      return false;
    return true;
  };

  useBackPress(() => {
    if (step === "addUserName") router.dismiss();
    else setBigStep("Index");
  });

  const { onClose } = useAuthModalStore();

  return (
    <AuthPagesContainer
      onBack={() => {
        if (step === "addUserName") onClose();
        else setBigStep("Index");
      }}
    >
      {/* page name */}
      <AppText
        fontSize={28}
        font="Bold"
        color={designSystem.colors.bigText}
        style={{ marginBottom: step === "enterOTP" ? 12 : 32 }}
      >
        {step === "enterPhoneNumber" && `Bienvenue à ${APP_NAME}`}

        {step === "enterOTP" && "Vérifiez votre numéro de téléphone"}

        {step === "addUserName" &&
          "Ajoutez un nom d'utilisateur pour continuer"}
      </AppText>

      {/* enter otp step*/}
      {step === "enterOTP" && (
        <AuthFormOtpCheck
          phoneNumber={phoneNumber}
          otpCode={code}
          setOtpCode={setCode}
          onEnter={async () => {
            console.log("otpCode", code);

            confirmCode();
          }}
        />
      )}

      {/* add user name */}
      {step === "addUserName" && <AuthAddUserNameContent />}

      {step === "enterPhoneNumber" && (
        <>
          <View style={styles.inputsSection}>
            {/*  phone number input  */}
            <AuthFormInputSection label={"Votre numero de telephone"}>
              <AppMobileNumberInput
                editable
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
            </AuthFormInputSection>
          </View>

          {/* info card */}
          <AuthFormInfoCard label=" Vous recevrez un code OTP de Skillr pour confirmer votre numéro." />

          {/* continous buutons  */}
          <AppButton
            isLoading={isLoading}
            title="Continuer"
            textStyle={{ fontSize: 14, fontWeight: "bold" }}
            onPress={async () => {
              if (phoneNumber.length === 8) {
                await handleSignInWithPhoneNumber();
              }
            }}
            disabled={ifContinousButtonDisabled()}
          />
        </>
      )}
    </AuthPagesContainer>
  );
}

const styles = StyleSheet.create({
  inputsSection: {
    marginBottom: 24,
    gap: 20,
  },
});
