import AddReviewSection from "@/components/announcement-details/sections/AnnouncementDetailsAddReviewSection";
import AnnouncementReviewRatingSummarySection from "@/components/announcement-review/AnnouncementReviewRatingSummarySection";
import Container from "@/components/Container";
import AppBottomModal from "@/components/modals/AppBottomModal";
import PageHeader from "@/components/PageHeader";
import ReviewCard from "@/components/ReviewCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const timeFilter = [
  "Derniers 30 jours",
  "Derniers 90 jours",
  "Derniers 360 jours",
];

export default function AnnouncementReviewPage() {
  const { designSystem } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [dropDownPickerOpen, setDropDownPickerOpen] = React.useState(false);
  const [addReviewsModalOpen, setAddReviewsModalOpen] = React.useState(false);
  const [value, setValue] = React.useState<
    "Derniers 30 jours" | "Derniers 90 jours" | "Derniers 360 jours"
  >("Derniers 30 jours");

  return (
    <Container
      style={[
        styles.container,
        { paddingBottom: insets.bottom, borderTopLeftRadius: 10 },
      ]}
    >
      <AppBottomModal
        isOpen={addReviewsModalOpen}
        setIsOpen={setAddReviewsModalOpen}
        headerText="Donner un avis"
      >
        <AddReviewSection useCase="AddReviewPage" />
      </AppBottomModal>

      {/* Header */}
      <PageHeader name="Avis des utilisateurs" />

      {/* Rating summary */}
      <AnnouncementReviewRatingSummarySection
        setAddReviewsModalOpen={setAddReviewsModalOpen}
      />

      {/* Filter section */}
      <DropDownPicker
        listMode="FLATLIST"
        items={timeFilter.map((time) => ({
          label: time,
          value: time,
        }))}
        open={dropDownPickerOpen}
        setOpen={setDropDownPickerOpen}
        value={value}
        setValue={setValue}
        style={[
          styles.filter,
          { borderColor: designSystem.colors.inputBorder },
        ]}
        labelStyle={{
          fontSize: 14,
          fontFamily: "BasisGrotesqueArabicPro-Regular",
        }}
        dropDownContainerStyle={{
          borderColor: "#ccc",
          backgroundColor: "#fff",
          borderRadius: 10,
        }}
        selectedItemLabelStyle={{
          color: designSystem.colors.primary,
          fontWeight: "bold",
        }}
        listItemLabelStyle={{
          fontFamily: "BasisGrotesqueArabicPro-Regular",
        }}
      />

      {/* Liste des avis */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <ReviewCard />}
        contentContainerStyle={styles.reviews}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  filter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  reviews: {
    gap: 20,
    paddingBottom: 50,
  },
});
