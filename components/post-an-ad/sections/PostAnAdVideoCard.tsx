import AppText from "@/components/custom/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function PostAnAdVideoCard({
  uri,
  onRemove,
  style,
}: {
  uri: string;
  onRemove: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.container, style]}>
      <Video
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.playBadge}>
          <AppText style={styles.playIcon}>▶</AppText>
        </View>
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
    borderRadius: 4,
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%" },
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
  playIcon: { color: "#fff", fontSize: 16 },
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
