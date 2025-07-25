import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AuthFormInputSection from "@/components/auth/form/AuthFormInputSection";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppEmailInput from "@/components/custom/input/AppEmailInput";
import AppPasswordInput from "@/components/custom/input/AppPasswordInput";
import { appName } from "@/constants";
import { isValidEmail, isValidPassword } from "@/functions/auth-form";
import { useSignInWithEmail } from "@/hooks/firebase/auth/signIn/useSignInWithEmail";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { AuthModalType } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SignInWithEmail({
  setBigStep,
}: {
  setBigStep: React.Dispatch<React.SetStateAction<AuthModalType>>;
}) {
  const { designSystem } = useAppTheme();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { handleSignInWithEmail, isLoading, error, setError } =
    useSignInWithEmail();

  const { ifPasswordValided } = isValidPassword(password);

  useBackPress(() => {
    setBigStep("Index");
  });

  return (
    <AuthPagesContainer onBack={() => setBigStep("Index")}>
      {/* page name */}
      <AppText
        fontSize={28}
        font="Bold"
        color={designSystem.colors.bigText}
        style={{ marginBottom: 32 }}
      >
        Connecter vous à {appName}
      </AppText>

      <View style={styles.inputsSection}>
        {/* error  */}
        {error && <AppText style={styles.error}>{error}</AppText>}

        {/*  email input  */}
        <AuthFormInputSection label={"Votre adresse email"}>
          <AppEmailInput
            editable
            email={email}
            setEmail={(text) => {
              if (error) setError("");
              setEmail(text);
            }}
            placeholder="example@gmail.com"
          />
        </AuthFormInputSection>

        {/*  password input  */}
        <AuthFormInputSection label={"Votre mot de passe"}>
          <>
            <AppPasswordInput
              editable
              value={password}
              placeholder="*********"
              onChangeText={(text) => {
                if (error) setError("");
                setPassword(text);
              }}
            />

            <Link
              style={[
                styles.link,
                { color: designSystem.colors.primary, marginTop: 10 },
              ]}
              href={"/(root)/(auth)/ForgotPassword"}
            >
              Mot de passe oublie ?
            </Link>
          </>
        </AuthFormInputSection>
      </View>

      {/* continous button */}
      <AppButton
        isLoading={isLoading}
        title="Continuer"
        textStyle={{ fontSize: 14, fontWeight: "bold" }}
        onPress={async () => {
          if (email && isValidEmail(email) && ifPasswordValided)
            await handleSignInWithEmail(email, password, setEmail, setPassword);
        }}
        disabled={
          email && isValidEmail(email) && ifPasswordValided ? false : true
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
        <TouchableOpacity onPress={() => setBigStep("signUpWithEmail")}>
          <AppText color={designSystem.colors.primary} style={[styles.link]}>
            Inscrivez-vous
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
  error: {
    color: "red",
    fontSize: 13,
  },

  link: {
    fontWeight: "bold",
  },
});
