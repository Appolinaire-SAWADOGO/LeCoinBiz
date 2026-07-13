import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function AnnonceDeepLinkRedirect() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      router.replace({
        pathname: "/(root)/(announcement)/AnnouncementDetails",
        params: { initialAdId: id as string, from: "OtherPage" },
      });
    }
  }, [id]);

  return null;
}
