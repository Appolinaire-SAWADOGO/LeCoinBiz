import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AuthFormInfoCard from "@/components/auth/form/AuthFormInfoCard";
import AuthFormInputSection from "@/components/auth/form/AuthFormInputSection";
import AuthFormOtpCheck from "@/components/auth/form/AuthFormOtpCheck";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import { APP_NAME } from "@/constants";
import { useSignInWithPhoneNumber } from "@/hooks/services/auth/signIn/useSignInWithPhoneNumber";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AuthModalStepType, ContinousWithPhomeNumberStepType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthContinousWithPhoneNumber({
  setBigStep,
}: {
  setBigStep: React.Dispatch<React.SetStateAction<AuthModalStepType>>;
}) {
  const { designSystem } = useAppTheme();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [step, setStep] =
    React.useState<ContinousWithPhomeNumberStepType>("enterPhoneNumber");

  const phoneNumberWithCountryCode = `+226${phoneNumber}`;

  const {
    handleSignInWithPhoneNumber,
    confirmCode,
    code,
    setCode,
    isLoading,
    error,
  } = useSignInWithPhoneNumber(setStep, phoneNumberWithCountryCode);

  const ifContinousButtonDisabled = () => {
    if (step === "enterPhoneNumber" && phoneNumber.length === 8 && !isLoading)
      return false;
    return true;
  };

  useBackPress(() => {
    setBigStep("Index");
  });

  const { onClose } = useAuthModalStore();

  return (
    <AuthPagesContainer
      onBack={() => {
        setBigStep("Index");
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
      </AppText>

      {/* enter otp step*/}
      {step === "enterOTP" && (
        <AuthFormOtpCheck
          isLoading={isLoading}
          phoneNumber={phoneNumber}
          otpCode={code}
          setOtpCode={setCode}
          onEnter={async () => {
            await confirmCode();
          }}
          error={error.enterOTP}
        />
      )}

      {step === "enterPhoneNumber" && (
        <>
          <View style={styles.inputsSection}>
            {error.enterPhoneNumber && (
              <AppText color="red">{error.enterPhoneNumber}</AppText>
            )}

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
          <AuthFormInfoCard>
            <AppText fontSize={12}>
              Vous recevrez un code OTP de{" "}
              <AppText fontSize={12} font="Medium">
                {APP_NAME}
              </AppText>{" "}
              pour confirmer votre numero de telephone.
            </AppText>
          </AuthFormInfoCard>

          {/* continous butons  */}
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
