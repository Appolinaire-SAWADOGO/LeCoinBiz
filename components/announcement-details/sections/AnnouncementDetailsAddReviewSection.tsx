import AppRate from "@/components/custom/AppRate";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppButton from "../../custom/AppButton";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsAddReviewSection({
  useCase = "AnnouncementDetailsPage",
}: {
  useCase?: "AddReviewPage" | "AnnouncementDetailsPage";
}) {
  const { designSystem } = useAppTheme();

  const [rating, setRating] = React.useState(0);

  return (
    <View style={styles.container}>
      {useCase === "AnnouncementDetailsPage" && (
        <AppText font="Bold" style={{ fontSize: 18, marginBottom: 12 }}>
          Ajouter un avis
        </AppText>
      )}

      <AppText style={styles.subSectionText}>Description</AppText>
      <TextInput
        multiline
        placeholder="Décrivez votre expérience ici..."
        placeholderTextColor="#999"
        style={[
          styles.input,
          { backgroundColor: designSystem.colors.infoCard },
        ]}
      />

      <AppText style={[styles.subSectionText, { marginTop: 20 }]}>
        Évaluez ce produit
      </AppText>

      <AppRate rating={rating} setRating={setRating} />

      <AppButton
        title="Soumettre l'avis"
        style={[
          styles.appButton,
          { backgroundColor: designSystem.colors.primary },
        ]}
        textStyle={styles.appButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,

    marginBottom: 20,
  },
  subSectionText: {
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderRadius: 12,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: "top",
    fontFamily: "BasisGrotesqueArabicPro-Regular",
    fontSize: 14,
    color: "#333",
  },
  appButton: {
    marginTop: 25,
    borderRadius: 8,
    paddingVertical: 10,
    width: 180,
  },
  appButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
