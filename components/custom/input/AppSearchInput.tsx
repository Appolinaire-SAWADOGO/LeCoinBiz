import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchIcon, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function AppSearchInput({
  search,
  setSearch,
  handleSearch,
  editable = true,
  onPress,
  activeOpacity = 0,
  onRefresh,
  filtersSearchModalOpen,
  onChangeText,
  onPressX,
}: {
  search: string;
  handleSearch?: (text: string) => Promise<void>;
  onChangeText?: (text: string) => Promise<void>;
  editable?: boolean;
  onPress?: () => void;
  activeOpacity?: number | undefined;
  onRefresh?: () => Promise<void>;
  setSearch?: (value: string | void) => void;
  filtersSearchModalOpen?: () => void;
  onPressX?: () => void;
}) {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.search, { borderColor: designSystem.colors.inputBorder }]}
      activeOpacity={activeOpacity}
      onPress={() => filtersSearchModalOpen?.()}
    >
      <SearchIcon width={16} height={16} color={designSystem.colors.bigText} />
      <TextInput
        value={search}
        onSubmitEditing={async (e) => await handleSearch?.(e.nativeEvent.text)}
        onChangeText={async (text) =>
          onChangeText ? await onChangeText(text) : setSearch
        }
        style={styles.textInput}
        placeholderTextColor={""}
        placeholder={"Recherche..."}
        editable={editable}
        onPress={onPress}
      />
      {search && (
        <TouchableOpacity
          style={styles.x}
          onPress={
            onPressX
              ? onPressX
              : async () => {
                  setSearch?.("");
                  await onRefresh?.();
                }
          }
        >
          <X color={"white"} width={12} height={12} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
