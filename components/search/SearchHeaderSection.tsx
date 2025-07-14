import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppSearchInput from "../custom/AppSearchInput";
import FilterModal from "../modals/filter-modal/FilterModal";

export default function SearchHeaderSection({
  search,
  setSearch,
  handleSearch,
  isSearching,
  useCase = "Search",
  userOrAdValue,
  setUserOrAdvalue,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  isSearching: boolean;
  useCase?: "Search" | "Favory";
  userOrAdValue: string;
  setUserOrAdvalue: React.Dispatch<
    React.SetStateAction<"annonces" | "utilisateurs">
  >;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: designSystem.colors.inputBorder },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={26}
            height={26}
            color={designSystem.colors.bigText}
          />
        </TouchableOpacity>

        {/* search input  */}
        <AppSearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
      </View>

      {/* filtrage */}
      {useCase === "Search" && (
        <FilterModal
          useCase={"Search"}
          userOrAdValue={userOrAdValue}
          setUserOrAdvalue={setUserOrAdvalue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    paddingTop: 12,
    gap: 15,
    borderBottomWidth: 0.5,
  },
});
