import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfileContentHead({
  contentHeadSelected,
  setContentHeadSelected,
  useCase,
}: {
  contentHeadSelected: number;
  setContentHeadSelected: React.Dispatch<React.SetStateAction<number>>;
  useCase: "profile" | "merchant";
}) {
  const { designSystem } = useAppTheme();

  const barColor = (number: number) => {
    if (contentHeadSelected === number) return designSystem.colors.primary;
    else return "transparent";
  };

  const textColor = (number: number) => {
    if (contentHeadSelected === number) return designSystem.colors.bigText;
    else return designSystem.colors.subText;
  };

  return (
    <View style={styles.container}>
      {/* In sell  */}
      <Pressable style={styles.child} onPress={() => setContentHeadSelected(0)}>
        <AppText
          color={textColor(0)}
          style={styles.childText}
          fontSize={16}
          font={"Medium"}
        >
          En vente
        </AppText>
        <View
          style={[
            styles.bar,
            {
              backgroundColor: barColor(0),
            },
          ]}
        />
      </Pressable>

      {/*  Désactivées  */}
      {useCase === "profile" && (
        <Pressable
          style={styles.child}
          onPress={() => setContentHeadSelected(1)}
        >
          <AppText
            color={textColor(1)}
            style={styles.childText}
            fontSize={16}
            font={"Medium"}
          >
            Désactivées
          </AppText>
          <View
            style={[
              styles.bar,
              {
                backgroundColor: barColor(1),
              },
            ]}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
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

  bar: {
    width: "100%",
    height: 3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
