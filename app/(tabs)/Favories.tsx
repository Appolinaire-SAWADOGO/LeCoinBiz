import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import FavoriesSearchHeaderSection from "@/components/favorites/FavoritesHeaderSection";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Favories() {
  const [search, setSearch] = React.useState<string>("");
  const [isSearching, setIsSearching] = React.useState(false);

  const insets = useSafeAreaInsets();

  const scrollY = new Animated.Value(0);
  const handleSearch = () => {
    setIsSearching(true);
  };

  return (
    <Container withBottom={false} style={{ backgroundColor: "#fff" }}>
      {/* header animation */}
      <HeaderHideAnimation
        scrollY={scrollY}
        headerHeight={300}
        style={[styles.HeaderHideAnimation, { top: insets.top }]}
      >
        {/* search header */}
        <FavoriesSearchHeaderSection
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
      </HeaderHideAnimation>

      {/* announce */}
      <Announcements scrollY={scrollY} style={{ paddingTop: 150 }} />
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
