import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import PostImage from "../assets/images/Post.png";

export default function PostAnAdButton() {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(root)/(announcement)/PostAnAd")}
      style={[
        styles.container,
        { backgroundColor: designSystem.colors.primary },
      ]}
    >
      <Image source={PostImage} style={styles.image} />
      <AppText font={"Medium"} style={styles.text}>
        Poster une annonce
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    width: 250,
    height: 50,
    borderRadius: 50,
    gap: 5,
    marginHorizontal: 20,
    position: "absolute",
    bottom: 20,
    zIndex: 20,
    alignSelf: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});
