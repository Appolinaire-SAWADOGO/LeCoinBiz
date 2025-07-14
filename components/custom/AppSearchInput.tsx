import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchIcon, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function AppSearchInput({
  search,
  setSearch,
  handleSearch,
}: {
  search: string;
  handleSearch: () => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={[styles.search, { borderColor: designSystem.colors.inputBorder }]}
    >
      <SearchIcon width={16} height={16} color={designSystem.colors.bigText} />
      <TextInput
        value={search}
        onSubmitEditing={handleSearch}
        onChangeText={(text) => {
          setSearch(text);
        }}
        style={styles.textInput}
        placeholderTextColor={""}
        placeholder={"Recherche..."}
      />
      {search && (
        <TouchableOpacity style={styles.x} onPress={() => setSearch("")}>
          <X color={"white"} width={12} height={12} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
