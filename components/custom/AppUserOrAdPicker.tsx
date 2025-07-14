import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import CaretDownDynSvg from "../svg/CaretDownDynSvg";
import AppText from "./AppText";

export default function AppUserOrAdPicker({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<"annonces" | "utilisateurs">>;
}) {
  const { designSystem } = useAppTheme();
  const [open, setOpen] = React.useState(false);
  return (
    <View>
      {/* picker btn */}
      <TouchableOpacity
        style={[
          styles.btn,
          {
            borderColor: designSystem.colors.inputBorder,
          },
        ]}
        onPress={() => setOpen((prev) => !prev)} // ← ouvre / ferme
      >
        <AppText style={styles.lbl}>{value}</AppText>
        <CaretDownDynSvg />
      </TouchableOpacity>

      {/* picker */}
      <DropDownPicker
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={setValue}
        items={[
          { label: "Annonces", value: "annonces" },
          { label: "Utilisateurs", value: "utilisateurs" },
        ]}
        style={{ display: "none" }}
        containerStyle={{ position: "absolute", top: 45, width: 120 }}
        dropDownContainerStyle={{
          zIndex: 1000,
          borderColor: designSystem.colors.inputBorder,
          backgroundColor: "#fff",
        }}
        listItemLabelStyle={{
          fontSize: 13,
          color: "#333",
          fontFamily: designSystem.fontFamily,
        }}
        selectedItemLabelStyle={{
          fontWeight: "bold",
          color: designSystem.colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderWidth: 1,
    // backgroundColor: "rgba(0,0,0,.04)",
    borderRadius: 50,
  },
  lbl: { fontWeight: "600", textTransform: "capitalize" },
});
