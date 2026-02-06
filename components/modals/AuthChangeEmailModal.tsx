import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useChangeEmailStore } from "@/store/useChangeEmailStore";
import { filterNotificationsQueryData } from "@/utils";
import { isValidEmail } from "@/utils/auth";
import { unsubscribeFromUserTopic } from "@/utils/notifications";
import auth from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import AuthPasswordInput from "../auth/form/AuthPasswordInput";
import Container from "../Container";
import AppButton from "../custom/AppButton";
import AppText from "../custom/AppText";
import AppEmailInput from "../custom/input/AppEmailInput";
import PageHeader from "../PageHeader";
import CheckDynSvg from "../svg/CheckDynSvg";
import AppFullModal from "./AppFullModal";

export default function AuthChangeEmailModal() {
  const user = useCurrentUser();

  const queryClient = useQueryClient();

  const { isOpen, close } = useChangeEmailStore();
  const { onOpen: openAutModal } = useAuthModalStore();

  const { designSystem } = useAppTheme();

  const [newEmail, setNewEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setSuccess(false);
    setNewEmail("");
    setPassword("");
  }, [isOpen]);

  const handleSubmmit = async () => {
    if (!newEmail.trim()) {
      setEmailError("Veuillez entrer une adresse email");
      return;
    }

    if (!isValidEmail(newEmail.trim())) {
      return;
    }

    if (!password.trim()) {
      setPasswordError("Veuillez entrer votre mot de passe");
      return;
    }

    if (newEmail.trim() === user?.email?.trim()) {
      setEmailError("Veuillez entrer une adresse email différente.");
      return;
    }

    if (!user || !user.email) {
      setError("Utilisateur non authentifié");
      return;
    }

    try {
      setPasswordError("");
      setEmailError("");
      setError("");
      setIsLoading(true);

      const credential = auth.EmailAuthProvider.credential(
        user.email,
        password,
      );

      await user.reauthenticateWithCredential(credential);

      await user.verifyBeforeUpdateEmail(newEmail.trim());

      await auth().signOut();

      if (user.uid) {
        await unsubscribeFromUserTopic(user.uid);
        filterNotificationsQueryData(queryClient, user.uid);
      }

      setSuccess(true);

      router.navigate("/(tabs)/Home");
    } catch (error: any) {
      console.log("CHANGE EMAIL ERROR:", error);

      if (error.code === "auth/wrong-password") {
        setPasswordError("Mot de passe incorrect");
      } else if (error.code === "auth/invalid-credential") {
        setPasswordError("Mot de passe incorrect");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Email invalide");
      } else if (error.code === "auth/email-already-in-use") {
        setEmailError("Email déjà utilisé");
      } else if (error.code === "auth/requires-recent-login") {
        setError("Veuillez vous reconnecter");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppFullModal
      isOpen={isOpen}
      onClose={close}
      style={{ paddingHorizontal: 20 }}
    >
      <Container>
        <PageHeader
          name={"Changer l'adresse e-mail"}
          onBack={close}
          style={{ marginBottom: 24 }}
        />

        {!success ? (
          <View style={{ gap: 20 }}>
            {error && <AppText style={{ color: "red" }}>{error}</AppText>}

            <View style={{ gap: 10 }}>
              <AppText font="Medium">Nouvelle adresse email</AppText>
              <AppEmailInput
                actionError={emailError}
                email={newEmail}
                setEmail={setNewEmail}
                placeholder=""
              />
            </View>

            <View style={{ gap: 10 }}>
              <AppText font="Medium">Mot de passe</AppText>
              <AuthPasswordInput
                value={password}
                onChangeText={setPassword}
                withConditions={false}
              />
              {passwordError ? (
                <AppText style={{ color: "red" }}>{passwordError}</AppText>
              ) : null}
            </View>

            <AppButton
              title="Changer"
              style={{
                width: "100%",
                marginTop: 10,
                alignSelf: "center",
              }}
              textStyle={{ fontSize: 15 }}
              textWeight="Bold"
              onPress={handleSubmmit}
              isLoading={isLoading}
              disabled={
                isLoading || !newEmail || !isValidEmail(newEmail) || !password
              }
            />
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <CheckDynSvg width={80} height={80} />

            <AppText
              font="Bold"
              fontSize={24}
              color={designSystem.colors.smallText}
              style={{ marginBottom: 12, marginTop: 24, textAlign: "center" }}
            >
              Adresse e-mail changée avec succès !
            </AppText>

            <AppText
              color={designSystem.colors.subText}
              style={{ marginBottom: 12, textAlign: "center" }}
            >
              Un lien de vérification est envoyé à{" "}
              <AppText font="Bold">{newEmail}</AppText>. Merci de vérifier votre
              boîte mail, puis de vous reconnecter une fois l’adresse confirmée.
            </AppText>

            <AppText
              color={designSystem.colors.subText}
              style={{ marginBottom: 12, textAlign: "center" }}
            >
              <AppText font="Bold">Important :</AppText> Si vous ne voyez pas
              l’e-mail, vérifiez également le dossier{" "}
              <AppText font="Bold">Spam / Courriers indésirables</AppText>.
            </AppText>

            <AppButton
              title="Se connecter"
              style={{
                width: "100%",
                marginTop: 10,
                alignSelf: "center",
                backgroundColor: designSystem.colors.secondary,
              }}
              textStyle={{ fontSize: 15 }}
              textWeight="Bold"
              onPress={() => {
                openAutModal();
                close();
              }}
            />
          </View>
        )}
      </Container>
    </AppFullModal>
  );
}
