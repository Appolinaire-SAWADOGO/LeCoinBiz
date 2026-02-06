import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useMemo } from "react";
import { DimensionValue, Pressable, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

interface Tab {
  id: number;
  label: string;
  key: string;
}

interface ProfileContentHeadProps {
  contentHeadSelected?: number;
  setContentHeadSelected?: React.Dispatch<React.SetStateAction<number>>;
  useCase: "profile" | "merchant";
  desabledAdsCount?: number;
  activatedAdsCount?: number;
  pendingAdsCount?: number;
}

export default function ProfileContentHead({
  contentHeadSelected = 0,
  setContentHeadSelected,
  useCase,
  desabledAdsCount,
  activatedAdsCount,
  pendingAdsCount,
}: ProfileContentHeadProps) {
  const { designSystem } = useAppTheme();

  const tabs: Tab[] = [
    { id: 0, label: "En vente", key: "active" },
    { id: 1, label: "Désactivées", key: "disabled" },
    { id: 2, label: "En attente", key: "pending" },
  ];

  const tabWidth = useMemo(() => {
    return `${100 / tabs.length}%`;
  }, [tabs.length]);

  const handleTabPress = (tabId: number) => {
    if (setContentHeadSelected && contentHeadSelected !== tabId) {
      setContentHeadSelected(tabId);
    }
  };

  const isTabSelected = (tabId: number) => contentHeadSelected === tabId;

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const selected = isTabSelected(tab.id);

          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, { width: tabWidth as DimensionValue }]}
              onPress={() => handleTabPress(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
            >
              <View style={styles.tabContent}>
                <AppText
                  color={
                    selected
                      ? designSystem.colors.primary
                      : designSystem.colors.subText
                  }
                  fontSize={15}
                  font="Medium"
                  style={styles.tabText}
                >
                  {tab.label} {useCase === "profile" && "\n"}
                  {tab.key === "active" &&
                    useCase === "profile" &&
                    `(${activatedAdsCount})`}{" "}
                  {tab.key === "disabled" &&
                    useCase === "profile" &&
                    `(${desabledAdsCount})`}{" "}
                  {tab.key === "pending" &&
                    useCase === "profile" &&
                    `(${pendingAdsCount})`}
                </AppText>

                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: selected
                        ? designSystem.colors.primary
                        : designSystem.colors.inputBorder,
                      opacity: 1,
                      height: selected ? 3 : 1,
                      borderTopLeftRadius: selected ? 5 : 0,
                      borderTopRightRadius: selected ? 5 : 0,
                    },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    paddingVertical: 12,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    marginBottom: 10,
    textAlign: "center",
    flexDirection: "column",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
