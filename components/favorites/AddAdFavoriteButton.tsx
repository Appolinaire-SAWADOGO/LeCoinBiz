import { useAddAdFavorites } from "@/hooks/services/ads/useAddAdFavorites";
import { useCheckAdFavorite } from "@/hooks/services/ads/useCheckAdFavorite";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AnnouncementType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AddAdFavoriteButton({
  adId,
  ad,
  fromAnnouncementCard = true,
  useCase,
}: {
  adId: string;
  ad: AnnouncementType;
  fromAnnouncementCard?: boolean;
  useCase?: "OtherPage" | "ProfilePage" | "HomePage";
}) {
  const { designSystem } = useAppTheme();

  const { addAdFavorites } = useAddAdFavorites();

  const { ifAdIsAddedToFavorites } = useCheckAdFavorite();

  const { onOpen: openAuthModal } = useAuthModalStore();

  const [isLoading, setIsLoading] = React.useState(false);

  const currentUser = useCurrentUser();

  const {
    data: isSelected,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: ["if-ad-is-added-to-favorites", adId],

    queryFn: () => ifAdIsAddedToFavorites(adId),

    staleTime: Infinity, // données immédiatement périmées → re-fetch au montage
    gcTime: Infinity, // garde en mémoire entre les navigations

    refetchOnMount: false, // re-fetche à chaque montage du composant
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  console.log("isSelected:", isSelected);

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!currentUser) {
          openAuthModal();
          return;
        }

        setIsLoading(true);

        await addAdFavorites(adId, ad);

        setIsLoading(false);
      }}
      hitSlop={10}
      style={
        fromAnnouncementCard
          ? [styles.favButton, { opacity: isLoading ? 0.5 : 1 }]
          : { opacity: isLoading ? 0.5 : 1 }
      }
      disabled={isLoading}
    >
      {fromAnnouncementCard ? (
        <MaterialCommunityIcons
          name={isSelected ? "heart" : "heart-outline"}
          size={17}
          color={
            isSelected
              ? designSystem.colors.primary
              : designSystem.colors.bigText
          }
        />
      ) : (
        <MaterialCommunityIcons
          name={isSelected ? "heart" : "heart-outline"}
          size={21}
          color={
            isSelected
              ? designSystem.colors.primary
              : designSystem.colors.bigText
          }
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  favButton: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, .7)",
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
