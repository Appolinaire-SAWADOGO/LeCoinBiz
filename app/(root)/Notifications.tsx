import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import React from "react";
import { View } from "react-native";

export default function Notifications() {
  return (
    <Container>
      <PageHeader name="Notifications" style={{ paddingHorizontal: 20 }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText>Pas de Notifications</AppText>
      </View>
    </Container>
  );
}
