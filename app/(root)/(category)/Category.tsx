import Announcements from "@/components/annoucement/Announcements";
import CategoryPageHeader from "@/components/categories/CategoryPageHeader";
import Container from "@/components/Container";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Animated, StyleSheet } from "react-native";

export default function Category() {
  const { category } = useLocalSearchParams();
  const scrollY = new Animated.Value(0);

  return (
    <Container style={styles.container} withBottom>
      {/* header */}
      <CategoryPageHeader category={category as string} scrollY={scrollY} />

      {/* Announcements */}
      <Announcements scrollY={scrollY} style={{ paddingTop: 150 }} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
  },
});
