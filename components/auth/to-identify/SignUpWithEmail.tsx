import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AuthFormInputSection from "@/components/auth/form/AuthFormInputSection";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppEmailInput from "@/components/custom/input/AppEmailInput";
import AppInput from "@/components/custom/input/AppInput";
import AppPasswordInput from "@/components/custom/input/AppPasswordInput";
import InfoDynSvg from "@/components/svg/InfoDynSvg";
import { APP_NAME } from "@/constants";
import { useSignUpWithEmail } from "@/hooks/services/auth/SignUp/useSignUpWithEmail";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { AuthModalType } from "@/types";
import { isValidEmail, isValidPassword, validateUsername } from "@/utils/auth";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SignUpWithEmail({
  setBigStep,
}: {
  setBigStep: React.Dispatch<React.SetStateAction<AuthModalType>>;
}) {
  const { designSystem } = useAppTheme();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userName, setUserName] = React.useState("");

  const { handleSignUpWithEmail, isLoading, error, setError } =
    useSignUpWithEmail();

  const { ifPasswordValided } = isValidPassword(password);

  const handleSetError = (type: "email" | "all", msg: string | null) => {
    setError((prev) => ({
      ...prev,
      [type]: msg,
    }));
  };

  const usernameInputBorderColor = () => {
    if (!userName) return designSystem.colors.inputBorder;

    if (!usernameValidation.isValid) return "red";
    return designSystem.colors.inputBorder;
  };

  useBackPress(() => {
    setBigStep("signInWithEmail");
  });

  const usernameValidation = validateUsername(userName);

  return (
    <AuthPagesContainer onBack={() => setBigStep("signInWithEmail")}>
      {/* page name */}
      <AppText
        fontSize={28}
        font="Bold"
        color={designSystem.colors.bigText}
        style={{ marginBottom: 32 }}
      >
        {`Inscrivez-vous à ${APP_NAME}`}
      </AppText>

      <View style={styles.inputsSection}>
        {error.all && <AppText color="red">{error.all}</AppText>}

        {/* user name */}
        <AuthFormInputSection label="Nom d'utilisateur">
          <AppInput
            placeholder="John Doe"
            model="withBorder"
            value={userName}
            onChangeText={setUserName}
            style={{
              borderColor: usernameInputBorderColor(),
            }}
          />
          {userName && usernameValidation.error && (
            <AppText style={{ marginTop: 8 }} color="red">
              {usernameValidation.error}
            </AppText>
          )}
        </AuthFormInputSection>

        {/*  email input   */}
        <AuthFormInputSection label={"Votre adresse email"}>
          <AppEmailInput
            editable
            placeholder="johndoe@gmail.com"
            email={email}
            setEmail={setEmail}
            value={email}
            onChangeText={(text) => {
              if (error.email) handleSetError("email", null);
              setEmail(text);
            }}
            actionError={error.email}
          />
        </AuthFormInputSection>

        {/*  password input   */}
        <AuthFormInputSection label={"Votre mot de passe"}>
          <AppPasswordInput
            placeholder="********"
            value={password}
            onChangeText={setPassword}
          />
        </AuthFormInputSection>
      </View>

      {/* info card */}
      <View style={styles.infoSection}>
        <InfoDynSvg />
        <AppText fontSize={12} style={{ lineHeight: 16 }}>
          En sélectionnant Suivant, j&apos;accepte{" "}
          <Link style={styles.infoLink} href="/(root)/(settings)/TermsOfUs">
            {" "}
            les Conditions Générales d&apos;Utilisation
          </Link>{" "}
          ,
          <Link style={styles.infoLink} href="/(root)/(settings)/PrivacyPolicy">
            {" "}
            la Politique de Confidentialité
          </Link>{" "}
          et
          <Link style={styles.infoLink} href="/(root)/(settings)/PostingRules">
            {" "}
            les Règles de Diffusion
          </Link>{" "}
          de {APP_NAME}.
        </AppText>
      </View>

      {/* continous button */}
      <AppButton
        isLoading={isLoading}
        title="Continuer"
        textStyle={{ fontSize: 14, fontWeight: "bold" }}
        onPress={async () => {
          if (isLoading) return;

          if (
            email &&
            isValidEmail(email) &&
            ifPasswordValided &&
            userName &&
            usernameValidation.isValid
          )
            await handleSignUpWithEmail(email, password, userName);
        }}
        disabled={
          !email ||
          !isValidEmail(email) ||
          !ifPasswordValided ||
          !userName ||
          !usernameValidation.isValid ||
          isLoading
        }
      />

      {/* link to sign up page */}
      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <AppText>Vous n&rsquo;avez pas de compte ? </AppText>

        <TouchableOpacity
          disabled={isLoading}
          onPress={() => {
            if (!isLoading) setBigStep("signInWithEmail");
          }}
        >
          <AppText
            color={
              isLoading
                ? designSystem.colors.secondary
                : designSystem.colors.primary
            }
            style={[styles.link]}
          >
            Connectez-vous
          </AppText>
        </TouchableOpacity>
      </View>
    </AuthPagesContainer>
  );
}

const styles = StyleSheet.create({
  inputsSection: {
    marginBottom: 24,
    gap: 20,
  },
  link: {
    fontWeight: "bold",
  },
  infoLink: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#DEE0E4",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
});
