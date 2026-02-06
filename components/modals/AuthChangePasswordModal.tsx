import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useChangePasswordStore } from "@/store/useChangePasswordModal";
import { validatePassword } from "@/utils/auth/validation";
import auth from "@react-native-firebase/auth";
import React, { useEffect } from "react";
import { View } from "react-native";
import AuthPasswordInput from "../auth/form/AuthPasswordInput";
import Container from "../Container";
import AppButton from "../custom/AppButton";
import AppText from "../custom/AppText";
import PageHeader from "../PageHeader";
import CheckDynSvg from "../svg/CheckDynSvg";
import AppFullModal from "./AppFullModal";

export default function AuthChangePasswordModal() {
  const user = useCurrentUser();

  const { isOpen, close } = useChangePasswordStore();

  const { designSystem } = useAppTheme();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [currentPasswordError, setCurrentPasswordError] = React.useState("");
  const [newPasswordError, setNewPasswordError] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setSuccess(false);
    setCurrentPassword("");
    setNewPassword("");
  }, [isOpen]);

  const handleSubmmit = async () => {
    if (!user || !user.email) {
      setError("Utilisateur non authentifié");
      return;
    }

    if (!currentPassword.trim()) {
      setCurrentPasswordError("Veuillez entrer votre mot de passe actuel");
      return;
    }

    if (!newPassword.trim()) {
      setNewPasswordError("Veuillez entrer un nouveau mot de passe");
      return;
    }

    if (!validatePassword(newPassword).isValid) {
      setNewPasswordError("Veuillez entrer un mot de passe valide");
      return;
    }

    try {
      setCurrentPasswordError("");
      setNewPasswordError("");
      setError("");
      setIsLoading(true);

      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword.trim()
      );

      await user.reauthenticateWithCredential(credential);

      await user.updatePassword(newPassword.trim());

      setCurrentPassword("");
      setNewPassword("");
      setSuccess(true);
    } catch (error: any) {
      console.log("CHANGE EMAIL ERROR:", error);

      if (error.code === "auth/wrong-password") {
        setCurrentPasswordError("Mot de passe actuel incorrect");
      } else if (error.code === "auth/invalid-credential") {
        setCurrentPasswordError("Mot de passe actuel incorrect");
      } else if (error.code === "auth/weak-password") {
        setNewPasswordError("Le mot de passe est trop faible");
      } else if (error.code === "auth/requires-recent-login") {
        setError("Pour des raisons de sécurité, veuillez vous reconnecter");
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
          name={"Changer le mot de passe"}
          onBack={close}
          style={{ marginBottom: 24 }}
        />

        {!success ? (
          <View style={{ gap: 20 }}>
            {error && <AppText style={{ color: "red" }}>{error}</AppText>}

            <View style={{ gap: 10 }}>
              <AppText font="Medium">Mot de passe actuel</AppText>
              <AuthPasswordInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                withConditions={false}
              />
              {currentPasswordError ? (
                <AppText style={{ color: "red" }}>
                  {currentPasswordError}
                </AppText>
              ) : null}
            </View>

            <View style={{ gap: 10 }}>
              <AppText font="Medium">Nouveau mot de passe</AppText>
              <AuthPasswordInput
                value={newPassword}
                onChangeText={setNewPassword}
              />
              {newPasswordError ? (
                <AppText style={{ color: "red" }}>{newPasswordError}</AppText>
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
                isLoading ||
                !currentPassword ||
                !validatePassword(newPassword).isValid
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
              Mot de passe a été changé avec succès !
            </AppText>

            <AppText
              color={designSystem.colors.subText}
              style={{ marginBottom: 12, textAlign: "center" }}
            >
              Votre mot de passe a été changé avec succès. Vous pouvez continuer
              à utiliser l'application normalement.
            </AppText>
          </View>
        )}
      </Container>
    </AppFullModal>
  );
}
