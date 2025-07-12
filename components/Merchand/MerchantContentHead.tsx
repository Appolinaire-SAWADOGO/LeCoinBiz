import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function MerchantContentHead({
  contentHeadSelected,
  setContentHeadSelected,
}: {
  contentHeadSelected: number;
  setContentHeadSelected: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* In sell  */}
      <Pressable style={styles.child} onPress={() => setContentHeadSelected(0)}>
        <AppText style={styles.childText} fontSize={16} font={"Medium"}>
          En vente
        </AppText>
        <View
          style={[
            styles.childBorderBottom,
            {
              backgroundColor:
                contentHeadSelected === 0
                  ? designSystem.colors.primary
                  : "transparent",
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  child: {
    width: "50%",
    alignItems: "center",
  },
  childText: {
    marginBottom: 8,
  },

  childBorderBottom: {
    width: "100%",
    height: 3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
