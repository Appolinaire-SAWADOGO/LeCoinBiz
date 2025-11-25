import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import AppDropDownPicker from "@/components/custom/picker/AppDropDownPicker";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function Test() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Apple ", value: "apple" },
    { label: "Banana ", value: "banana" },
    { label: "Orange ", value: "orange" },
  ]);

  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* 👇 BOUTON ICÔNE MENU */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setOpen(!open)}
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {/* 👇 DROPDOWN SANS LE CHAMP */}
      <AppDropDownPicker
        items={items}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        listMode={"SCROLLVIEW"}
        withSearch={false}
        showTickIcon={false}
        style={{
          display: "none",
        }}
        dropDownContainerStyle={{
          width: 150,
          borderColor: designSystem.colors.inputBorder,
          borderWidth: 1,
        }}
        selectedItemLabelStyle={{
          color: "#000",
          fontWeight: "normal",
        }}
        onSelectItem={(item) => {
          console.log("Tu as cliqué :", item.label, item.value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    paddingHorizontal: 20,
    zIndex: 2000,
  },
  menuButton: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
