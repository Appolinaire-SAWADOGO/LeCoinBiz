import { useAddAdFavorites } from "@/hooks/services/ads/useAddAdFavorites";
import { useCheckAdFavorite } from "@/hooks/services/ads/useCheckAdFavorite";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AnnouncementType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
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

  const { data: isSelected } = useQuery({
    queryKey: ["if-ad-is-added-to-favorites", adId],
    queryFn: () => ifAdIsAddedToFavorites(adId),
    enabled: !!adId,

    staleTime: Infinity, // ✅ Les données ne deviennent JAMAIS stale
    gcTime: Infinity, // ✅ Les données ne sont JAMAIS supprimées du cache

    refetchOnWindowFocus: false, // ✅ Pas de refetch au focus
    refetchOnMount: false, // ✅ Pas de refetch au montage
    refetchOnReconnect: false, // ✅ Pas de refetch lors de la reconnexion
    retry: 2,
  });

  const currentUser = useCurrentUser();

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
        <Heart
          size={16}
          color={
            isSelected
              ? designSystem.colors.primary
              : designSystem.colors.bigText
          }
          fill={isSelected ? designSystem.colors.primary : "none"}
        />
      ) : (
        <Heart
          fill={isSelected ? designSystem.colors.primary : "none"}
          size={20}
          color={designSystem.colors.bigText}
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
