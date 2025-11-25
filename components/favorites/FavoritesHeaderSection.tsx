import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function FavoriesSearchHeaderSection({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<"annonces" | "utilisateurs">>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: designSystem.colors.inputBorder },
      ]}
    >
      {/* head */}
      <View style={styles.head}>
        {/* title */}
        <AppText font="Bold" color={designSystem.colors.bigText} fontSize={28}>
          Favories
        </AppText>

        {/* select favorite ad or favorite user */}
        {/* <AppUserOrAdPicker value={value} setValue={setValue} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    gap: 12,
    paddingTop: 24,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderWidth: 1,
    borderRadius: 50,
  },
  lbl: { fontWeight: "600", textTransform: "capitalize" },
});
