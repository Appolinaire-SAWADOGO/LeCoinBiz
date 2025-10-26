import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import SearchHeaderSection from "@/components/search/SearchHeaderSection";
import Users from "@/components/user/Users";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const { designSystem } = useAppTheme();

  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const scrollY = new Animated.Value(0);
  const [userOrAdValue, setUserOrAdValue] = React.useState<
    "annonces" | "utilisateurs"
  >("annonces");
  const insets = useSafeAreaInsets();

  const handleSearch = () => {
    setIsSearching(true);
  };

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
    }
  }, [search]);

  return (
    <Container style={[styles.container]} withBottom>
      <HeaderHideAnimation
        scrollY={scrollY}
        headerHeight={300}
        style={[styles.HeaderHideAnimation, { top: insets.top }]}
      >
        <SearchHeaderSection
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          isSearching={isSearching}
          userOrAdValue={userOrAdValue}
          setUserOrAdvalue={setUserOrAdValue}
        />
      </HeaderHideAnimation>

      {/* annonces */}
      {userOrAdValue === "annonces" && (
        <Announcements
          scrollY={scrollY}
          style={{ paddingBottom: 0, paddingTop: 165 }}
        />
      )}

      {/* utilisateurs */}
      {userOrAdValue === "utilisateurs" && (
        <Users scrollY={scrollY} style={{ paddingTop: 153 }} />
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
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // main: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   overflow: "hidden",
  //   borderTopRightRadius: 10,
  //   borderTopStartRadius: 10,
  // },
});
