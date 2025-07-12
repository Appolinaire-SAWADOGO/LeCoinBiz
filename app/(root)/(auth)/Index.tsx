import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import ShoppingBagDynSvg from "@/components/svg/ShoppingBagDynSvg";
import { appName } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Index() {
  const { designSystem } = useAppTheme();
  const sigupText = `Inscrivez-vous à ${appName}`;
  const sigInText = `Connectez-vous à ${appName}`;

  return (
    <AuthPagesContainer
      style={{
        backgroundColor: designSystem.colors.primary,
      }}
      iconColor={"#fff"}
    >
      {/* main */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ShoppingBagDynSvg />
        <AppText
          font="Bold"
          color="#fff"
          fontSize={40}
          style={{ marginBottom: 20, marginTop: 40 }}
        >
          {appName}
        </AppText>
        <AppText
          style={{ textAlign: "center", marginBottom: 40 }}
          fontSize={15}
          color="#fff"
        >
          Trouvez facilement des produits et vendeurs de confiance autour de
          vous.
        </AppText>
        <AppButton
          title={sigupText}
          style={{
            backgroundColor: "white",
            height: 53,
            width: "100%",
            marginBottom: 20,
          }}
          textColor={designSystem.colors.primary}
          textStyle={{ fontSize: 15, fontWeight: "bold" }}
          onPress={() =>
            router.push("/(root)/(auth)/SignUp?type=signUpWithPhomeNumber")
          }
        />
        <AppButton
          title={sigInText}
          style={{
            backgroundColor: "transparent",
            height: 53,
            width: "100%",
            borderWidth: 1,
            borderColor: "#fff",
            elevation: 0,
            marginBottom: 24,
          }}
          textColor={"white"}
          textStyle={{ fontSize: 15, fontWeight: "bold" }}
          onPress={() =>
            router.push("/(root)/(auth)/SignIn?type=signInWithPhomeNumber")
          }
        />
      </View>
    </AuthPagesContainer>
  );
}
