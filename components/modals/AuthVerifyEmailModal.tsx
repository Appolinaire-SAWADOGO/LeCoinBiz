import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useVerifyEmailStore } from "@/store/useVerifyEmailStore";
import { authEvents } from "@/utils/EventEmitter";
import { sendEmailVerification } from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Container from "../Container";
import AppText from "../custom/AppText";
import PageHeader from "../PageHeader";
import CheckDynSvg from "../svg/CheckDynSvg";
import AppFullModal from "./AppFullModal";

export default function AuthVerifyEmailModal() {
  const { designSystem } = useAppTheme();
  const { isOpen, close } = useVerifyEmailStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const currentUser = useCurrentUser();

  useBackPress(() => close());

  useEffect(() => {
    if (currentUser) {
      setEmailVerified(currentUser.emailVerified);
    }
  }, [currentUser]);

  const handleResendEmail = async () => {
    if (!currentUser || emailVerified) return;

    try {
      setErrorMessage("");
      setMessage("");
      setIsLoading(true);

      await sendEmailVerification(currentUser);

      setMessage("E-mail de vérification envoyé !");
    } catch (error: any) {
      console.log("SEND EMAIL ERROR:", error);

      if (error.code === "auth/too-many-requests") {
        setErrorMessage("Trop de tentatives. Réessayez plus tard.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Pas de connexion internet.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Adresse email invalide.");
      } else {
        setErrorMessage("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerified = async () => {
    setIsChecking(true);

    await currentUser?.reload();
    await currentUser?.getIdToken(true);

    authEvents.emit("profile_updated");

    setEmailVerified(currentUser?.emailVerified || false);

    if (currentUser?.emailVerified) {
      setTimeout(() => {
        setIsChecking(false);
        close();
      }, 2000);
    }

    setIsChecking(false);
  };

  return (
    <AppFullModal
      isOpen={isOpen}
      onClose={close}
      style={{ paddingHorizontal: 20 }}
    >
      <Container>
        <PageHeader
          name={"Adresse Email"}
          onBack={close}
          style={{ marginBottom: 24 }}
        />

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <CheckDynSvg
            fill={emailVerified ? undefined : designSystem.colors.subText}
            width={80}
            height={80}
          />

          <AppText
            font="Bold"
            fontSize={24}
            color={designSystem.colors.smallText}
            style={{ marginBottom: 12, marginTop: 24, textAlign: "center" }}
          >
            {emailVerified
              ? "Adresse email vérifiée avec succès !"
              : "Vérifier l'adresse e-mail"}
          </AppText>

          {!emailVerified && (
            <>
              <AppText
                color={designSystem.colors.subText}
                style={{ marginBottom: 12, textAlign: "center" }}
              >
                Un lien de vérification serai envoyé a{" "}
                <AppText font="Bold">{currentUser?.email}</AppText>. Veuillez
                vérifier votre boite mail pour vérifier votre compte.
              </AppText>

              <AppText
                color={designSystem.colors.subText}
                style={{ marginBottom: 12, textAlign: "center" }}
              >
                <AppText font="Bold">Important :</AppText> Si vous ne voyez pas
                l’e-mail, vérifiez également le dossier{" "}
                <AppText font="Bold">Spam / Courriers indésirables</AppText>.
              </AppText>
            </>
          )}

          {errorMessage !== "" && !emailVerified && (
            <AppText
              color={"red"}
              style={{ marginVertical: 10, textAlign: "center" }}
            >
              {errorMessage}
            </AppText>
          )}

          {message !== "" && !emailVerified && (
            <AppText
              color={"green"}
              style={{ marginVertical: 10, textAlign: "center" }}
            >
              {message}
            </AppText>
          )}

          <View style={{ marginTop: 12, gap: 10, flexDirection: "row" }}>
            {!emailVerified && (
              <>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleResendEmail}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    backgroundColor: designSystem.colors.primary,
                    borderRadius: 50,
                    opacity: isLoading ? 0.6 : 1,
                    width: "auto",
                    alignItems: "center",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <AppText font="Bold" color="#fff">
                      Envoyer le lien
                    </AppText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCheckVerified}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    backgroundColor: designSystem.colors.secondary,
                    borderRadius: 50,
                    width: "auto",
                    alignItems: "center",
                  }}
                >
                  {isChecking ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <AppText font="Bold" color="#fff">
                      J'ai vérifié
                    </AppText>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Container>
    </AppFullModal>
  );
}
