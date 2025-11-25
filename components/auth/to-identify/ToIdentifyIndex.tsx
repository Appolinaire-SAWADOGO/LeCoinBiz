import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import MailDynSvg from "@/components/svg/MailDynSvg";
import PhoneDynSvg from "@/components/svg/PhoneDynSvg";
import ShoppingBagDynSvg from "@/components/svg/ShoppingBagDynSvg";
import GoogleDynSvg from "@/components/svg/social-media/GoogleDynSvg";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AuthModalType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ToIdentifyIndex({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AuthModalType>>;
}) {
  const { designSystem } = useAppTheme();

  const insets = useSafeAreaInsets();

  const { onClose } = useAuthModalStore();

  useBackPress(() => onClose());

  return (
    <View
      style={{
        backgroundColor: designSystem.colors.primary,
        paddingHorizontal: 20,
        height: "100%",
      }}
    >
      {/* header */}
      <PageHeader
        iconColor="#fff"
        style={{
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          borderBottomWidth: 0,
        }}
        onBack={onClose}
      />

      {/* main */}
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ShoppingBagDynSvg />
        <AppText
          font="Bold"
          color="#fff"
          fontSize={40}
          style={{
            marginBottom: 20,
            marginTop: 30,
            textAlign: "center",
            lineHeight: 45,
          }}
        >
          Rejoignez nous
        </AppText>
        <AppText
          style={{ textAlign: "center", marginBottom: 20 }}
          fontSize={15}
          color="#fff"
        >
          Trouvez facilement des produits et vendeurs de confiance autour de
          vous.
        </AppText>
        <AppButton
          title={"Continuer avec un numéro de téléphone"}
          Icon={PhoneDynSvg}
          iconColor={designSystem.colors.primary}
          style={styles.button}
          textColor={designSystem.colors.primary}
          textStyle={{ fontSize: 14, fontWeight: "bold" }}
          onPress={() => setStep("continousWithPhoneNumber")}
        />
        <AppButton
          title={"Continuer avec un e-mail"}
          Icon={MailDynSvg}
          iconColor={designSystem.colors.primary}
          style={styles.button}
          textColor={designSystem.colors.primary}
          textStyle={{ fontSize: 14, fontWeight: "bold" }}
          onPress={() => setStep("signInWithEmail")}
        />
        <AppButton
          title={"Continuer avec Google"}
          Icon={GoogleDynSvg}
          iconColor={designSystem.colors.primary}
          style={styles.button}
          textColor={designSystem.colors.primary}
          textStyle={{ fontSize: 14, fontWeight: "bold" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    width: "100%",
    marginBottom: 20,
  },
});
