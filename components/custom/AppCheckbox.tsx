import { useAppTheme } from "@/hooks/useAppTheme";
import { AdOptionsPickerType, MaterialCommunityIconsNameType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../ui/checkbox";
import { CheckIcon } from "../ui/icon";
import AppText from "./AppText";

export default function AppCheckbox({
  isChecked,
  setOptions,
  icon,
  label,
}: {
  isChecked: () => boolean;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
  icon: MaterialCommunityIconsNameType;
  label: string;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.section}>
      <Checkbox
        value="1"
        size="md"
        isInvalid={false}
        isDisabled={false}
        isChecked={isChecked()}
        onChange={() => {
          setOptions((prev) => {
            return prev.map((item) =>
              item.label === label ? { ...item, active: !item.active } : item,
            );
          });
        }}
      >
        <CheckboxIndicator
          style={{
            backgroundColor: isChecked()
              ? designSystem.colors.primary
              : "transparent",

            borderColor: isChecked() ? designSystem.colors.primary : "#777",
            borderRadius: 50,
          }}
        >
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel
          style={{
            color: isChecked() ? designSystem.colors.primary : "",
          }}
        >
          <View style={styles.checkboxLabelContain}>
            <MaterialCommunityIcons
              name={icon}
              size={16}
              style={styles.checkboxImage}
              color={isChecked() ? designSystem.colors.primary : "#000"}
            />
            <AppText
              color={isChecked() ? designSystem.colors.primary : "#000"}
              font={isChecked() ? "Medium" : "Regular"}
            >
              {label}
            </AppText>
          </View>
        </CheckboxLabel>
      </Checkbox>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabelContain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  checkboxImage: {},
});
