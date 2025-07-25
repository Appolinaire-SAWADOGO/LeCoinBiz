import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import FavoriesSearchHeaderSection from "@/components/favorites/FavoritesHeaderSection";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import Users from "@/components/user/Users";
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [value, setValue] = React.useState<"annonces" | "utilisateurs">(
    "annonces"
  );
  const insets = useSafeAreaInsets();
  const scrollY = new Animated.Value(0);

  return (
    <Container withBottom={false} style={{ backgroundColor: "#fff" }}>
      {/* header animation */}
      <HeaderHideAnimation
        scrollY={scrollY}
        headerHeight={300}
        style={[styles.HeaderHideAnimation, { top: insets.top }]}
      >
        {/* search header */}
        <FavoriesSearchHeaderSection value={value} setValue={setValue} />
      </HeaderHideAnimation>

      {/* announce */}
      {value === "annonces" && (
        <Announcements scrollY={scrollY} style={{ paddingTop: 95 }} />
      )}
      {value === "utilisateurs" && (
        <Users
          scrollY={scrollY}
          style={{ paddingTop: 80, paddingBottom: 10 }}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  HeaderHideAnimation: {
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
