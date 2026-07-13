import { useAppTheme } from "@/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AnnonceDeepLinkRedirect() {
  const { id } = useLocalSearchParams();
  const { designSystem } = useAppTheme();

  console.log("AnnonceDeepLinkRedirect id:", id);

  useEffect(() => {
    if (id) {
      router.navigate({
        pathname: "/(root)/(announcement)/AnnouncementDetails",
        params: { initialAdId: id as string, from: "OtherPage" },
      });
    }
  }, [id]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <ActivityIndicator size="large" color={designSystem.colors.primary} />
    </View>
  );
}
