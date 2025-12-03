import { useAuthStore } from "@/store/useAuthStore";
import { initialInvalidQuery } from "@/utils/auth";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export function SplashScreenController() {
  const initAuthState = useAuthStore((s) => s.initAuthState);

  useEffect(() => {
    (async () => {
      await initAuthState();
      await initialInvalidQuery();
      SplashScreen.hideAsync();
    })();
  }, []);

  return null;
}
