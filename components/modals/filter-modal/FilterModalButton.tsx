import CaretDownDynSvg from "@/components/svg/CaretDownDynSvg";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FilterModalUseCaseType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";
import { Button, ButtonText } from "../../ui/button";

export default function FilterModalButton({
  isFiltered,
  open,
  useCase,
  userOrAdValue,
  setUserOrAdvalue,
}: {
  isFiltered: boolean;
  open: () => void;
  useCase: FilterModalUseCaseType;
  userOrAdValue?: string;
  setUserOrAdvalue?: React.Dispatch<
    React.SetStateAction<"annonces" | "utilisateurs">
  >;
}) {
  const { designSystem } = useAppTheme();

  const FilterButton = () => (
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
      onPress={() => open()}
    >
      <ButtonText>
        <View style={styles.buttonText}>
          <AppText fontSize={14} color="#000">
            Filtrer par
          </AppText>
          <CaretDownDynSvg />
        </View>
      </ButtonText>
    </Button>
  );

  return (
    <View style={styles.sort}>
      {/* <AppText
        fontSize={17}
        color={designSystem.colors.bigText}
        font="Bold"
        style={styles.sectionTitle}
      >
        {(useCase === "Search" &&
          userOrAdValue === "annonces" &&
          "Annonces Recentes") ||
          (useCase !== "Search" && "Announces Recentes") ||
          (useCase === "Search" &&
            userOrAdValue === "utilisateurs" &&
            "Utulisateurs Correspondants")}
      </AppText> */}

      {/* <View style={{ flexDirection: "row", gap: 10 }}> */}
      {/* filter button */}
      {/* {(useCase === "Search" && userOrAdValue === "annonces" && ( */}
      {/* <FilterButton /> */}
      {/* )) || */}
      {/* (useCase !== "Search" && <FilterButton />)} */}

      {/* {useCase === "Search" && userOrAdValue && setUserOrAdvalue && ( */}
      {/* // <AppUserOrAdPicker */}
      {/* // value={userOrAdValue} */}
      {/* setValue={setUserOrAdvalue} */}
      {/* /> */}
      {/* )} */}
      {/* </View> */}

      <FilterButton />
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
    paddingHorizontal: 12,
    width: 110,
  },
});
