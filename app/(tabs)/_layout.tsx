import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAddUsernameModalStore } from "@/store/useAddUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { getCurrentUserAuthMethod } from "@/utils/auth";
import { EventArg } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Heart, HomeIcon, Settings, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { designSystem } = useAppTheme();

  const { onOpen: onOpenAuthModal } = useAuthModalStore();
  const { onOpen: onOpenAddUsernameModal } = useAddUsernameModalStore();

  const fill = (color: string) =>
    color === designSystem.colors.primary
      ? designSystem.colors.primaryLight
      : "transparent";

  const currentUser = useCurrentUser();
  const currentUserAuthMethod = getCurrentUserAuthMethod(currentUser);

  const onPress = (
    e: EventArg<"tabPress", true, undefined>,
    navigation: any,
    withUserNameIsAdded: boolean
  ) => {
    if (!currentUser) {
      e.preventDefault();
      onOpenAuthModal();
      navigation.navigate("Home");
      return;
    }

    if (
      currentUserAuthMethod === "phone" &&
      !currentUser?.displayName &&
      withUserNameIsAdded
    ) {
      e.preventDefault();
      onOpenAddUsernameModal();
      navigation.navigate("Home");
      return;
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#5D5D5D",
        tabBarActiveTintColor: designSystem.colors.primary,
        headerShown: false,
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
          tabBarLabelStyle: {
            fontFamily: "BasisGrotesqueArabicPro-Regular",
            fontSize: 11,
          },
        }}
      />
      <Tabs.Screen
        name="Favorites"
        options={{
          title: "Favories",
          tabBarIcon: ({ color }) => (
            <Heart size={24} fill={fill(color)} color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "BasisGrotesqueArabicPro-Regular",
            fontSize: 11,
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => onPress(e, navigation, false),
        })}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={24} fill={fill(color)} color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "BasisGrotesqueArabicPro-Regular",
            fontSize: 11,
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => onPress(e, navigation, true),
        })}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Parametres",
          tabBarIcon: ({ color }) => (
            <Settings size={24} fill={fill(color)} color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "BasisGrotesqueArabicPro-Regular",
            fontSize: 11,
          },
        }}
      />
    </Tabs>
  );
}
