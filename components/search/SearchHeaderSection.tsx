import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import FilterModal from "../modals/filter-modal/FilterModal";

export default function SearchHeaderSection({
  search,
  setSearch,
  handleSearch,
  isSearching,
  useCase = "Search",
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  isSearching: boolean;
  useCase?: "Search" | "Favory";
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
        <View
          style={[
            styles.search,
            { borderColor: designSystem.colors.inputBorder },
          ]}
        >
          <SearchIcon
            width={16}
            height={16}
            color={designSystem.colors.bigText}
          />
          <TextInput
            value={search}
            onSubmitEditing={handleSearch}
            onChangeText={(text) => {
              setSearch(text);
            }}
            style={styles.textInput}
            placeholderTextColor={""}
            placeholder={"Search..."}
          />
          {search && (
            <TouchableOpacity style={styles.x} onPress={() => setSearch("")}>
              <X color={"white"} width={12} height={12} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* filtrage */}
      {useCase === "Search" && <FilterModal useCase={"Search"} />}
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
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    height: 44,
    borderWidth: 1,
    borderRadius: 50,

    paddingHorizontal: 20,
    flex: 1,
  },
  textInput: {
    fontSize: 14,
    flex: 1,
    fontFamily: "BasisGrotesqueArabicPro-Regular",
  },
  x: {
    height: 16,
    width: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#313131",
  },
});
