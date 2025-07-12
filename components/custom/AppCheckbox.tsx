import { useAppTheme } from "@/hooks/useAppTheme";
import { AdOptionsPickerType } from "@/types";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
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
  image,
  label,
}: {
  isChecked: () => boolean;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
  image: ImageSourcePropType;
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
            const finded = prev.find((item) => item.label === label);
            finded!.active = !finded!.active;
            return [...prev, finded!];
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
            <Image source={image} style={styles.checkboxImage} />
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
  checkboxImage: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});
