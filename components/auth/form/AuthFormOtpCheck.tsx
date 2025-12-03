import AppButton from "@/components/custom/AppButton";
import AppOtp from "@/components/custom/AppOtp";
import AppText from "@/components/custom/AppText";
import AppFullModal from "@/components/modals/AppFullModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { hexToRgba } from "@/utils";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function AuthFormOtpCheck({
  phoneNumber,
  otpCode,
  setOtpCode,
  onEnter,
  isLoading,
  error,
}: {
  phoneNumber: string;
  otpCode: string;
  setOtpCode: React.Dispatch<React.SetStateAction<string>>;
  onEnter: () => Promise<void>;
  isLoading?: boolean;
  error: string | null;
}) {
  const { designSystem } = useAppTheme();

  const [isModalOpen, setIsModalOpen] = React.useState(isLoading);

  useEffect(() => {
    setIsModalOpen(isLoading);
  }, [isLoading]);

  return (
    <>
      <AppFullModal
        isOpen={isModalOpen!}
        onClose={() => {}}
        bgColor={hexToRgba(designSystem.colors.secondary, 0.01)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={designSystem.colors.secondary} />
      </AppFullModal>

      <AppText
        style={{ lineHeight: 20, marginBottom: 32 }}
        fontSize={14}
        color={designSystem.colors.subText}
      >
        Entrez le code qui a été envoyé à votre{" "}
        <AppText font="Bold" color={designSystem.colors.bigText}>
          numéro WhatsApp +226 {phoneNumber}
        </AppText>
      </AppText>
      <AppOtp code={otpCode} setCode={setOtpCode} onEnter={onEnter} />
      {error && (
        <AppText color="red" style={{ marginTop: 10, marginBottom: 12 }}>
          {error}
        </AppText>
      )}
      <AppText style={{ marginTop: error ? 0 : 24, marginBottom: 12 }}>
        Vous n&apos;avez pas reçu le code ?
      </AppText>

      <AppButton
        title="Renvoyer le code"
        style={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: designSystem.colors.smallText,
          elevation: 0,
          height: 34,
          width: 160,
        }}
        textColor={designSystem.colors.bigText}
        textStyle={{ fontSize: 14 }}
      />
    </>
  );
}
