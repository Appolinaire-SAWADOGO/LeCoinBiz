import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppEmailInput from "@/components/custom/input/AppEmailInput";
import { APP_NAME } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SignInWithEmailStepType } from "@/types";
import { validateEmail } from "@/utils/auth/validation";
import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { ArrowLeft, ArrowRight, X } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthForgotPassword({
  setBigStep,
}: {
  setBigStep: React.Dispatch<React.SetStateAction<SignInWithEmailStepType>>;
}) {
  const [step, setStep] = React.useState<"resetPassword" | "CheckYourInbox">(
    "resetPassword"
  );
  const [email, setEmail] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  const { designSystem } = useAppTheme();

  const resetPassword = async () => {
    const auth = getAuth();

    if (!validateEmail(email).isValid) return;

    try {
      setError(null);
      setIsLoading(true);

      let fetchUser = await firestore()
        .collection("Users")
        .where("email", "==", email)
        .get();

      if (fetchUser.empty) {
        setError("Aucun utilisateur trouve avec cet email.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setStep("CheckYourInbox");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0} // Ajuste si besoin
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* header  */}
          <View
            style={{
              paddingVertical: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TouchableOpacity
                disabled={step === "resetPassword"}
                onPress={() => {
                  if (step === "CheckYourInbox") setStep("resetPassword");
                  else return;
                }}
              >
                <ArrowLeft
                  size={22}
                  color={
                    step === "resetPassword"
                      ? designSystem.colors.infoCard
                      : "#000"
                  }
                />
              </TouchableOpacity>

              <ArrowRight size={22} color={designSystem.colors.infoCard} />
            </View>
            <AppText fontSize={15} font="Bold">
              Mot de passe oublie ?
            </AppText>
            <TouchableOpacity onPress={() => setBigStep("signin")}>
              <X size={22} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, justifyContent: "space-between", gap: 20 }}>
            {/* main */}
            <View style={{ paddingTop: 48 }}>
              <AppText
                color={designSystem.colors.primary}
                font="Bold"
                fontSize={34}
                style={{ alignSelf: "center", marginBottom: 40 }}
              >
                {APP_NAME}
              </AppText>

              {/* reset password */}
              {step === "resetPassword" && (
                <>
                  <TouchableOpacity
                    onPress={() => setBigStep("signin")}
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <ArrowLeft size={20} />
                    <AppText font="Medium">Retour a la connexion</AppText>
                  </TouchableOpacity>

                  <AppText
                    style={{ marginBottom: 12 }}
                    fontSize={24}
                    font="Bold"
                  >
                    Reinitialisons votre mot de passe.
                  </AppText>

                  <AppText
                    style={{ marginBottom: 20 }}
                    color={designSystem.colors.subText}
                  >
                    Nous vous enverrons par courriel un lien que vous pourrez
                    utiliser pour réinitialiser votre mot de passe.
                  </AppText>

                  <View style={{ gap: 8 }}>
                    {error && (
                      <AppText style={{ marginBottom: 8 }} color="red">
                        {error}
                      </AppText>
                    )}
                    <AppText font="Medium">Email</AppText>
                    <AppEmailInput
                      onChangeText={() => {
                        if (error) setError(null);
                        else return;
                      }}
                      email={email}
                      setEmail={setEmail}
                    />
                  </View>
                </>
              )}

              {/* check your inbox */}
              {step === "CheckYourInbox" && (
                <View style={{ gap: 20 }}>
                  <AppText fontSize={24} font="Bold">
                    Consultez votre boite de reception
                  </AppText>
                  <AppText>
                    Nous avons envoye un lien a{" "}
                    <AppText font="Medium">{email}</AppText> pour vous aider a
                    configurer un nouveau mot de passe si vous avez un compte
                    chez nous.
                  </AppText>
                  <AppText>
                    <AppText font="Bold">Important :</AppText> Si vous ne voyez
                    pas l’e-mail, vérifiez également le dossier{" "}
                    <AppText font="Bold">Spam / Courriers indésirables</AppText>
                    .
                  </AppText>
                </View>
              )}

              <AppButton
                title={
                  step === "resetPassword" ? "Suivant" : "Renvoyer le lien"
                }
                variant="secondary"
                disabled={isLoading || !validateEmail(email).isValid}
                isLoading={isLoading}
                style={{ marginTop: 24 }}
                onPress={resetPassword}
              />
            </View>

            {/* footer */}
            <View
              style={{
                paddingVertical: 24,
                paddingHorizontal: 20,
                marginHorizontal: -20,
                backgroundColor: "#F7F4FB",
              }}
            >
              <AppText color={designSystem.colors.subText}>
                <AppText fontSize={15}>©</AppText> 2024, {APP_NAME}. Tous
                droits reserves
              </AppText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
