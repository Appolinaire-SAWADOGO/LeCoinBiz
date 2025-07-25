import AppButton from "@/components/custom/AppButton";
import AppOtp from "@/components/custom/AppOtp";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";

export default function AuthFormOtpCheck({
  phoneNumber,
  otpCode,
  setOtpCode,
  onEnter,
}: {
  phoneNumber: string;
  otpCode: string;
  setOtpCode: React.Dispatch<React.SetStateAction<string>>;
  onEnter: () => void;
}) {
  const { designSystem } = useAppTheme();

  return (
    <>
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
      <AppOtp code={otpCode} setCode={setOtpCode} onEnter={() => onEnter()} />
      <AppText style={{ marginTop: 24, marginBottom: 12 }}>
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
