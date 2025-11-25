import CategoryCard from "@/components/categories/CategoryCard";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { CATEGORIES } from "@/constants/categories";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AllCategories() {
  return (
    <Container style={styles.container}>
      {/* header */}
      <PageHeader name="Toutes les catégories" />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}
      >
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
          />
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 20,
  },
});
