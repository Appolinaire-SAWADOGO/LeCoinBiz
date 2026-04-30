import AppText from "@/components/custom/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function PostAnAdVideoCard({
  uri,
  onRemove,
}: {
  uri: string;
  onRemove: () => void;
}) {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
      />
      {/* Overlay avec bouton supprimer */}
      <View style={styles.overlay}>
        {/* Icône play au centre */}
        <View style={styles.playBadge}>
          <AppText style={styles.playIcon}>▶</AppText>
        </View>
        {/* Bouton supprimer */}
        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.5}
          style={styles.deleteBtn}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={"white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 4,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 16,
  },
  deleteBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
