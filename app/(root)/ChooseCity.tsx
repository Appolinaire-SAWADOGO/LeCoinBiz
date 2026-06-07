import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppCityPicker from "@/components/custom/picker/AppCityPicker";
import LocDynSvg from "@/components/svg/LocDynSvg";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useGetNotifications } from "@/hooks/services/notifications/useGetNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function ChooseCity() {
  const queryClient = useQueryClient();
  const { getHomeAds } = useGetHomeAds();
  const { getNotifications } = useGetNotifications();

  const [city, setCity] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const saveCity = async () => {
    if (!city) return;

    try {
      setIsLoading(true);

      await AsyncStorage.setItem(
        "user_location",
        JSON.stringify({
          country: "burkina faso",
          city: city,
        }),
      );

      setIsLoading(false);
      setIsError(false);

      router.replace("/(tabs)/Home");
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("Erreur lors du stockage du pays :", error);
    }
  };

  return (
    <Container style={[styles.container]}>
      <LocDynSvg width={200} height={200} />

      <AppText style={styles.headerTitle} font="Bold">
        Dites-nous où vous êtes
      </AppText>

      <AppText style={styles.subTitle}>
        Cela nous aide à vous montrer les annonces les plus proches de vous.
      </AppText>

      <AppCityPicker
        cityPickerOpen={showPicker}
        setCityPickerOpen={setShowPicker}
        cityValue={city}
        setCityValue={(value: string) => {
          setCity(value);
          setIsError(false);
        }}
        withAllCity={false}
        style={styles.cityPicker}
      />

      {isError && (
        <AppText style={{ alignSelf: "flex-start", color: "red" }}>
          Une erreur est survenue, veuillez réessayer.
        </AppText>
      )}

      <AppButton
        onPress={saveCity}
        title="Valider ma ville"
        style={[styles.button]}
        textStyle={styles.buttonText}
        disabled={!city || isLoading}
        isLoading={isLoading}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Fond blanc
  },
  headerTitle: {
    fontSize: 22,
    color: "#1B2430", // Texte foncé
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  subTitle: {
    fontSize: 14,
    color: "#444", // Gris foncé lisible
    textAlign: "center",
    marginBottom: 30,
  },
  cityPicker: {
    marginBottom: 15,
    backgroundColor: "#F3F4F6", // Gris clair pour contraste doux
    borderRadius: 10,
    padding: 10,
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF", // Texte blanc sur bouton foncé
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
