import CaretDown from "@/assets/images/CaretDown.png";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";
import { Button, ButtonText } from "../../ui/button";

export default function FilterModalButton({
  isFiltered,
  setIsOpen,
}: {
  isFiltered: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.sort}>
      <AppText
        fontSize={17}
        color={designSystem.colors.bigText}
        font="Bold"
        style={styles.sectionTitle}
      >
        Recent Announcements
      </AppText>

      <Button
        style={[
          styles.button,

          {
            backgroundColor: isFiltered
              ? designSystem.colors.primaryLight
              : "transparent",
            borderColor: isFiltered
              ? designSystem.colors.primary
              : designSystem.colors.inputBorder,
          },
        ]}
        onPress={() => setIsOpen(true)}
      >
        <ButtonText>
          <View style={styles.buttonText}>
            <AppText fontSize={14} color="#000">
              Filtrer par
            </AppText>
            <Image width={14} height={14} source={CaretDown} />
          </View>
        </ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  sort: {
    paddingTop: 16,
    paddingBottom: 5,
  },
  sectionTitle: {
    marginBottom: 4,
  },

  buttonText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  button: {
    backgroundColor: "transparent",
    borderWidth: 1,

    borderRadius: 50,
    width: 100,
  },
});
