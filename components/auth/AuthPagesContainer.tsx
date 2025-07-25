import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Container from "../Container";

export default function AuthPagesContainer({
  iconColor = "#000",
  children,
  style,
  scrollViewContentStyle,
  onBack,
  backRef,
}: {
  iconColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollViewContentStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
  backRef?: React.Ref<View>;
}) {
  return (
    <Container style={[style]}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            ref={backRef}
            onPress={() => {
              if (onBack) {
                onBack();
                return;
              } else router.back();
            }}
            hitSlop={10}
          >
            <ArrowLeft size={22} color={iconColor} />
          </TouchableOpacity>
          <View />
          <View />
        </View>

        {children}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
  },
});
