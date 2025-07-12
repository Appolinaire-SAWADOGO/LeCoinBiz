import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import SearchHeaderSection from "@/components/search/SearchHeaderSection";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const { designSystem } = useAppTheme();

  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const scrollY = new Animated.Value(0);

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
        />
      </HeaderHideAnimation>

      {/* <View style={styles.main}> */}
      <Announcements
        scrollY={scrollY}
        style={{ paddingBottom: 0, paddingTop: 165 }}
      />
      {/* </View> */}
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
