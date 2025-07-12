import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function AppDropDownPicker({
  withSearch,
  placeholder,
  items,
  open,
  setOpen,
  value,
  setValue,
}: {
  withSearch?: boolean;
  placeholder: string;
  items: { label: string; value: string; icon?: () => React.JSX.Element }[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <>
      <DropDownPicker
        listMode="MODAL"
        searchable={withSearch}
        searchPlaceholder={withSearch ? "Rechercher..." : undefined}
        searchTextInputStyle={{
          borderRadius: 8,
        }}
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={setValue}
        placeholder={placeholder}
        items={items}
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          borderColor: value
            ? designSystem.colors.primary
            : designSystem.colors.inputBorder,
          //   borderColor: designSystem.colors.inputBorder,
          borderWidth: 1,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
        dropDownContainerStyle={{
          borderColor: "#ccc",
          backgroundColor: "#fff",
          borderRadius: 10,
        }}
        textStyle={{
          fontSize: 14,
          color: "#333",
          fontFamily: designSystem.fontFamily,
        }}
        listItemLabelStyle={{
          fontSize: 14,
          color: "#333",
        }}
        listItemContainerStyle={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderBottomColor: designSystem.colors.inputBorder,
          borderBottomWidth: 1,
        }}
        selectedItemLabelStyle={{
          fontWeight: "bold",
          color: designSystem.colors.primary,
        }}
        modalProps={{
          animationType: "slide",
        }}
        modalContentContainerStyle={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          flexGrow: 1,
        }}
        zIndex={1000}
      />
    </>
  );
}
