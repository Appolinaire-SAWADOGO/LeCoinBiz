import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

type NotificationCardProps = {
  title: string;
  message: string;
  createdAt?: string;
};

export default function NotificationCard({
  title,
  message,
  createdAt,
}: NotificationCardProps) {
  const { designSystem } = useAppTheme();
  return (
    <View
      style={[styles.card, { borderColor: designSystem.colors.inputBorder }]}
    >
      <AppText style={styles.title} font="Medium">
        {title}
      </AppText>

      <AppText style={styles.message}>{message}</AppText>

      {createdAt && (
        <AppText color={designSystem.colors.subText} style={[styles.date]}>
          {createdAt.replace("Publié", "")}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fafafac3",
    borderWidth: 1,
    gap: 10,
  },
  title: {
    fontSize: 15,
    // marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  date: {
    // marginTop: 10,
    fontSize: 13,
    textAlign: "left",
  },
  leftIndicator: {
    width: 7.7,
    height: 7.7,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 6,
  },
});
