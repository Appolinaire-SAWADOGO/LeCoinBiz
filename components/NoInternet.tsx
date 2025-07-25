import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import NoInternetDynSvg from "./NoInternetDynSvg";

export default function NoInternet() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* <TopBottomBackground withBottom={false} /> */}
      <NoInternetDynSvg width={390} height={211} />
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <AppText
          fontSize={17}
          color={designSystem.colors.smallText}
          font={"Black"}
          style={styles.title}
        >
          votre internet n&lsquo;est pas disponible
        </AppText>
        <AppText color={designSystem.colors.subText} style={styles.text}>
          Essayez de passer à une autre connexion ou de réinitialiser votre
          connexion Internet pour trouver un professionnel.
        </AppText>
        <AppButton textColor={"white"} style={styles.button} title={"Retry"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  title: {
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 30,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    marginBottom: 26,
  },
  button: {
    width: 95,
    height: 42,
  },
});
