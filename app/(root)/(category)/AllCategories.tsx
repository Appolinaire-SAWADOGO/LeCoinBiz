import CategoryCard from "@/components/categories/CategoryCard";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { CATEGORIES } from "@/constants/categories";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AllCategories() {
  const { designSystem } = useAppTheme();

  return (
    <Container style={styles.container}>
      {/* header */}
      <PageHeader name="Toutes les catégories" />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            style={{
              width: "33.3333%",
              height: "16%",
              alignItems: "center",
              // marginBottom: 40,
            }}
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
