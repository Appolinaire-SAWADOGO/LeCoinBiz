import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import { default as ChatDynSvg } from "@/components/svg/onboarding/ChatDynSvg";
import MyLocationDynSvg from "@/components/svg/onboarding/MyLocationDynSvg";
import PhotoDynSvg from "@/components/svg/onboarding/PhotoDynSvg";
import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const slides: Array<{
  image: ({
    width,
    height,
  }: {
    width?: number | undefined;
    height?: number | undefined;
  }) => React.JSX.Element;
  title: string;
  description: string;
}> = [
  {
    image: MyLocationDynSvg,
    title: "Annonces locales",
    description:
      "Trouve des annonces dans ton quartier, ta ville ou toute ta région au Burkina..",
  },
  {
    image: PhotoDynSvg,
    title: "Photos et vidéos",
    description:
      "Regarde exactement ce que tu vas acheter grâce aux photos et vidéos que les vendeurs publient.",
  },
  {
    image: ChatDynSvg,
    title: "Contact facile",
    description:
      "Échange directement avec les vendeurs pour conclure en toute confiance.",
  },
];

export default function Onboarding() {
  const { designSystem } = useAppTheme();
  const [step, setStep] = useState(0);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem("onboarding_completed", "true");
      await Notifications.requestPermissionsAsync();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'onboarding :", error);
    }
    router.replace("/(root)/ChooseCity");
  }, []);

  const nextStep = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Container style={styles.container}>
      <PageHeader
        withBackButton={false}
        style={{ alignSelf: "flex-end", borderBottomWidth: 0 }}
      >
        <TouchableOpacity onPress={completeOnboarding}>
          <AppText
            fontSize={16}
            font="Bold"
            color={designSystem.colors.primary}
          >
            Passer
          </AppText>
        </TouchableOpacity>
      </PageHeader>

      <View style={styles.innerContainer}>
        <View style={styles.card}>
          {slides[step].image({ width: 200, height: 200 })}

          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === step && {
                    backgroundColor: designSystem.colors.primary,
                  },
                ]}
              />
            ))}
          </View>

          <AppText font="Bold" fontSize={22} style={styles.slideTitle}>
            {slides[step].title}
          </AppText>

          <AppText
            color={designSystem.colors.subText}
            style={styles.slideDescription}
          >
            {slides[step].description}
          </AppText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 40,
          }}
        >
          <TouchableOpacity onPress={prevStep}>
            {step > 0 && (
              <AppText font={"Bold"} color={designSystem.colors.primary}>
                Retour
              </AppText>
            )}
          </TouchableOpacity>

          <AppButton
            title={step < slides.length - 1 ? "Suivant" : "Commencer"}
            onPress={nextStep}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  innerContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 30,
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
    color: "#141414",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
  },
  iconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 34,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  slideTitle: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  slideDescription: {
    textAlign: "center",
    lineHeight: 22,
  },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 5,
  },
  primaryButton: {
    width: 130,
    height: 44,
    borderRadius: 5,
  },
  skipButton: {
    marginTop: 16,
  },
});
