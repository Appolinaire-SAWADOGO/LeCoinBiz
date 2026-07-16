import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import DropDownPicker, {
  ItemType,
  ListModeType,
} from "react-native-dropdown-picker";

export default function AppDropDownPicker({
  withSearch,
  placeholder,
  items,
  open,
  setOpen,
  value,
  setValue,
  style,
  dropDownContainerStyle,
  selectedItemLabelStyle,
  isSelected,
  listMode = "MODAL",
  onSelectItem,
  showTickIcon,
}: {
  withSearch?: boolean;
  placeholder?: string;
  items: { label: string; value: string; icon?: () => React.JSX.Element }[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string | null;
  setValue:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((value: string | null) => void);
  style?: StyleProp<ViewStyle>;
  dropDownContainerStyle?: StyleProp<ViewStyle>;
  selectedItemLabelStyle?: StyleProp<TextStyle>;
  isSelected?: boolean;
  listMode?: ListModeType | undefined;
  onSelectItem?: (item: ItemType<string>) => void;
  showTickIcon?: boolean | undefined;
}) {
  const { designSystem } = useAppTheme();

  return (
    <>
      <DropDownPicker
        listMode={listMode}
        searchable={withSearch}
        searchPlaceholder={withSearch ? "Rechercher..." : undefined}
        placeholder={placeholder}
        dropDownDirection={"BOTTOM"}
        searchTextInputStyle={{
          // borderRadius: 8,
          borderWidth: 0,
          borderBottomWidth: 1,
        }}
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={
          setValue as React.Dispatch<React.SetStateAction<string | null>>
        }
        items={items}
        style={[
          {
            backgroundColor: "#fff",
            borderRadius: 8,
            borderColor: isSelected
              ? designSystem.colors.primary
              : designSystem.colors.inputBorder,
            borderWidth: 1,
            paddingHorizontal: 14,
            paddingVertical: 10,
          },
          style,
        ]}
        dropDownContainerStyle={[
          {
            borderColor: "#ccc",
            backgroundColor: "#fff",
            borderRadius: 8,
          },
          dropDownContainerStyle,
        ]}
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
          height: 50,
        }}
        selectedItemLabelStyle={[
          {
            fontWeight: "bold",
            color: designSystem.colors.primary,
          },
          selectedItemLabelStyle,
        ]}
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
        onSelectItem={onSelectItem}
        showTickIcon={showTickIcon}
      />
    </>
  );
}
