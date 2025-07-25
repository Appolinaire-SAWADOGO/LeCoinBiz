import AppFullScreenLoader from "@/components/custom/AppFullScreenLoader";
import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useCallback } from "react";

export default function Layout() {
  const { userIsLogged, userNameIsAdded } = useAuthStore();
  const router = useRouter();
  const { onOpen: onOpenAuthModal } = useAuthModalStore();
  const { onOpen: onOpenAddUsernameModal } = useAddYourUsernameModalStore();

  useFocusEffect(
    useCallback(() => {
      if (!userIsLogged) {
        onOpenAuthModal();
        setTimeout(() => {
          router.push("/(tabs)/Home");
        }, 100); // petit délai pour laisser le modal s’afficher
        return;
      }

      if (!userNameIsAdded) {
        onOpenAddUsernameModal();
        setTimeout(() => {
          router.push("/(tabs)/Home");
        }, 100);
        return;
      }
    }, [
      userIsLogged,
      userNameIsAdded,
      onOpenAuthModal,
      onOpenAddUsernameModal,
      router,
    ])
  );

  if (!userIsLogged || !userNameIsAdded) return <AppFullScreenLoader />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" />
    </Stack>
  );
}
