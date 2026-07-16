import { router } from "expo-router";
import React from "react";
import SettingElement from "../SettingElement";
import SettingSectionContainer from "../SettingSectionContainer";

export default function SettingNavigationSection() {
  return (
    <SettingSectionContainer title="Navigation">
      <SettingElement
        icon="map-marker"
        color="#25B7D3"
        label="Ville de navigation"
        onClick={() => router.navigate("/(root)/(settings)/Navigation")}
      />
    </SettingSectionContainer>
  );
}
