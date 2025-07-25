import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppCityPicker from "@/components/custom/picker/AppCityPicker";
import LocDynSvg from "@/components/svg/LocDynSvg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function ChooseCity() {
  const [city, setCity] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);

  const saveCity = async () => {
    if (!city) return;

    try {
      await AsyncStorage.setItem(
        "user_location",
        JSON.stringify({
          country: "burkina faso",
          city: city,
        })
      );
      router.push("/(tabs)/Home");
    } catch (error) {
      console.error("Erreur lors du stockage du pays :", error);
    }
  };

  return (
    <Container style={[styles.container]}>
      <LocDynSvg width={150} height={150} />

      <AppText style={styles.headerTitle} font="Bold">
        Dites-nous où vous êtes 📍
      </AppText>

      <AppText style={styles.subTitle}>
        Cela nous aide à vous montrer les annonces les plus proches de vous.
      </AppText>

      <AppCityPicker
        cityPickerOpen={showPicker}
        setCityPickerOpen={setShowPicker}
        cityValue={city}
        setCityValue={setCity}
        withAllCity={false}
        style={styles.cityPicker}
      />

      <AppButton
        onPress={saveCity}
        title="Valider ma ville"
        style={[styles.button]}
        textStyle={styles.buttonText}
        disabled={!city}
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
    fontSize: 26,
    color: "#1B2430", // Texte foncé
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  subTitle: {
    fontSize: 16,
    color: "#444", // Gris foncé lisible
    textAlign: "center",
    marginBottom: 30,
  },
  cityPicker: {
    marginBottom: 30,
    backgroundColor: "#F3F4F6", // Gris clair pour contraste doux
    borderRadius: 10,
    padding: 10,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF", // Texte blanc sur bouton foncé
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
