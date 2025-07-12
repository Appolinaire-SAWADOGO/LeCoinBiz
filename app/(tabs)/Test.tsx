import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function Test() {
  return (
    <Container>
      <TouchableOpacity onPress={() => router.push("/(root)/(auth)/Index")}>
        <AppText>Signin/SignUp</AppText>
      </TouchableOpacity>
    </Container>
  );
}
