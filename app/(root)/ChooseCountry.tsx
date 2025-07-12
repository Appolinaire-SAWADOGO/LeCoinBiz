import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronUp } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";

export default function ChooseCountry() {
  const { designSystem } = useAppTheme();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = useCallback(async (country: Country) => {
    try {
      setSelectedCountry(country);
      setShowPicker(false);

      await AsyncStorage.setItem(
        "user_country",
        JSON.stringify({
          name: country.name,
          code: country.cca2,
        })
      );
    } catch (error) {
      console.error("Erreur lors du stockage du pays :", error);
    }
  }, []);
  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: designSystem.colors.primary },
      ]}
    >
      <AppText style={styles.title} font={"Bold"}>
        Choisissez votre pays
      </AppText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <ChevronUp color={"white"} style={{ marginRight: 10 }} />
        {selectedCountry ? (
          <>
            <Image
              source={{
                uri: `https://flagcdn.com/w80/${selectedCountry?.cca2.toLowerCase()}.png`,
              }}
              style={{ width: 30, height: 20, borderRadius: 2 }}
            />
            <Text style={styles.inputText}>
              {selectedCountry.name.toString().length > 22
                ? selectedCountry.name.toString().slice(0, 22) + "..."
                : selectedCountry.name.toString()}
            </Text>
          </>
        ) : (
          <AppText style={styles.placeholder} font={"Medium"}>
            Sélectionner un pays
          </AppText>
        )}
      </TouchableOpacity>

      <AppButton
        onPress={() => router.push("/(tabs)/Home")}
        textStyle={{ color: designSystem.colors.bigText }}
        title={"Valider"}
        disabled={!selectedCountry}
        style={{
          backgroundColor: selectedCountry
            ? "white"
            : "rgba(255 , 255 ,255 , .5)",
          marginTop: 30,
        }}
      />

      {showPicker && (
        <CountryPicker
          theme={{
            backgroundColor: designSystem.colors.primary,
            onBackgroundTextColor: "#fff",
            primaryColor: "#1e90ff",
            fontFamily: "BasisGrotesqueArabicPro-Regular",
            filterPlaceholderTextColor: "#aaa",
            activeOpacity: 0.4,
          }}
          countryCode={"BF"}
          withFilter
          withFlag
          withCountryNameButton
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
          visible
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 27,
    marginBottom: 20,
    textAlign: "center",
    color: "#FFF",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "rgba(255 , 255 , 255 ,.15)",
  },
  inputText: {
    color: "#FFF",
    fontSize: 16,
  },
  placeholder: {
    fontSize: 16,
    color: "#FFF",
  },
  flag: {
    fontSize: 24,
  },
});
