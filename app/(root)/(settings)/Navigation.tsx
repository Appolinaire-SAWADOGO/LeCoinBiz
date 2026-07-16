import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppCityPicker from "@/components/custom/picker/AppCityPicker";
import PageHeader from "@/components/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getUserCity, showToast } from "@/utils"; // adapte le chemin selon l'emplacement réel de ton fichier utils
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function Navigation() {
  const { designSystem } = useAppTheme();
  const queryClient = useQueryClient();

  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [city, setCity] = useState("");

  useEffect(() => {
    const loadSavedCity = async () => {
      const savedCity = await getUserCity();
      if (savedCity) {
        setCity(savedCity);
      }
    };

    loadSavedCity();
  }, []);

  const saveCity = async () => {
    if (!city) return;

    try {
      showToast("loading", "Traitement en cours.", 0);

      await AsyncStorage.setItem(
        "user_location",
        JSON.stringify({
          country: "burkina faso",
          city,
        }),
      );

      queryClient.invalidateQueries({ queryKey: ["home-ads"] });

      Toast.hide();
      showToast("success", "Ville de navigation mise à jour.", 0);
    } catch (error) {
      Toast.hide();
      showToast("error", "Impossible de mettre à jour la ville.", 0);
      console.error("Erreur lors du stockage de la ville :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container withGoBack>
      <PageHeader
        name="Ville de navigation"
        style={{ paddingHorizontal: 20 }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <AppText font="Medium" style={styles.sectionTitle}>
          Votre ville
        </AppText>
        <AppText fontSize={14} style={styles.text}>
          Modifiez la ville utilisée pour la navigation et l'affichage des
          annonces proches de vous sur la page d'accueil.
        </AppText>

        <AppCityPicker
          cityPickerOpen={showPicker}
          setCityPickerOpen={setShowPicker}
          cityValue={city}
          setCityValue={(value: string) => {
            setCity(value);
          }}
          withAllCity={false}
          style={styles.cityPicker}
        />

        <AppButton
          onPress={saveCity}
          title="Enregistrer la ville"
          style={styles.button}
          disabled={!city || isLoading}
          isLoading={isLoading}
        />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  cityPicker: {
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
  },
});
