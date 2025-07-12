import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronUp } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import AppText from "../custom/AppText";

export default function ChangeCountryPicker() {
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(
    null
  );
  const [showPicker, setShowPicker] = React.useState(false);

  const handleSelect = React.useCallback(async (country: Country) => {
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
    <View>
      {/* 🌍 Changer de pays
              <AppText font="Medium" fontSize={16} style={{ marginBottom: 8 }}>
                Pays
              </AppText>
              <ChangeCountryPicker /> */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <ChevronUp color={"#000"} style={{ marginRight: 10 }} />
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
            Changez un pays
          </AppText>
        )}
      </TouchableOpacity>

      {showPicker && (
        <CountryPicker
          theme={{
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
  },
  placeholder: {
    fontSize: 16,
  },
});
