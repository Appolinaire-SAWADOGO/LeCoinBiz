import { useAppTheme } from "@/hooks/useAppTheme";
import { usePickVideo } from "@/hooks/usePickVideo";
import { Plus, Video } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function PostAnAdAddVideoCard({
  disabled,
  onVideoSelected,
  style,
}: {
  disabled: boolean;
  onVideoSelected: (uri: string | undefined) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();
  const { pickVideo } = usePickVideo();

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!disabled) {
          await pickVideo((uri) => onVideoSelected(uri));
        }
      }}
      disabled={disabled}
      activeOpacity={0.5}
      style={[
        styles.container,
        {
          borderColor: disabled ? "#ccc" : designSystem.colors.inputBorder,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Video strokeWidth={1.3} size={36} color={designSystem.colors.bigText} />
      <View
        style={[
          styles.addIcon,
          { backgroundColor: designSystem.colors.smallText },
        ]}
      >
        <Plus strokeWidth={1.3} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: "dashed",
  },
  addIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: -18,
  },
});
