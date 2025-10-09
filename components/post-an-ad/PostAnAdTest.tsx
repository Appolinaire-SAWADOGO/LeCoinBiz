import React from "react";
import { SectionList, Text, TouchableOpacity } from "react-native";

export default function PostAnAdTest() {
  const data = [
    {
      title: "Véhicules",
      data: ["Voitures", "Motos"],
    },
    {
      title: "Immobilier",
      data: ["Maisons", "Terrains"],
    },
    {
      title: "Électronique",
      data: ["Téléphones", "Ordinateurs"],
    },
  ];

  const handleSelect = (item: string) => {
    console.log("Sélectionné :", item);
    // ici tu peux setValue(item) ou naviguer
  };

  return (
    <SectionList
      sections={data}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelect(item)}>
          <Text style={{ padding: 12, fontSize: 14, color: "#333" }}>
            • {item}
          </Text>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text
          style={{
            paddingTop: 20,
            paddingBottom: 8,
            paddingHorizontal: 12,
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: "#f0f0f0",
          }}
        >
          {title}
        </Text>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
