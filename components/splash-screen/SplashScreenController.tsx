import { useAuthStore } from "@/store/useAuthStore";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";

export function SplashScreenController() {
  const [isLoading, setIsLoading] = React.useState(true);

  const initAuthState = useAuthStore((s) => s.initAuthState);

  useEffect(() => {
    (async () => {
      await initAuthState();
      setIsLoading(false);
      SplashScreen.hideAsync();
    })();
  }, []);

  if (!isLoading) {
    return null;
  }

  return null;
}
