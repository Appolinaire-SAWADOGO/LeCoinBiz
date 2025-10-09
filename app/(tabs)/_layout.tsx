// import { HapticTab } from "@/app-example/components/HapticTab";
// import TabBarBackground from "@/app-example/components/ui/TabBarBackground";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Tabs } from "expo-router";
import { Heart, HomeIcon, Settings, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { designSystem } = useAppTheme();

  const fill = (color: string) =>
    color === designSystem.colors.primary
      ? designSystem.colors.primaryLight
      : "transparent";

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#5D5D5D",
        tabBarActiveTintColor: designSystem.colors.primary,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HomeIcon size={24} fill={fill(color)} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favories"
        options={{
          title: "Favories",

          tabBarIcon: ({ color }) => (
            <Heart size={24} fill={fill(color)} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={24} fill={fill(color)} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Parametres"
        options={{
          title: "Parametres",
          tabBarIcon: ({ color }) => (
            <Settings size={24} fill={fill(color)} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
