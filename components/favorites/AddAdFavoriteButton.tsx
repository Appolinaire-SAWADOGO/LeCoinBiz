import { useAddAdFavorites } from "@/hooks/services/ads/useAddAdFavorites";
import { useCheckUserAcces } from "@/hooks/services/auth/useCheckUserAcces";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AddAdFavoriteButton({
  adId,
  fromAnnouncementCard = true,
}: {
  adId: string;
  fromAnnouncementCard?: boolean;
}) {
  const { designSystem } = useAppTheme();

  const { checkUserAccess } = useCheckUserAcces();

  const { ifAdIsAddedToFavorites, addAdFavorites } = useAddAdFavorites();

  const { data: isSelected } = useQuery({
    queryKey: ["if_ad_is_added_to_favorites", adId],
    queryFn: () => ifAdIsAddedToFavorites(adId),
    enabled: !!adId,
  });

  return (
    <TouchableOpacity
      style={fromAnnouncementCard ? styles.favButton : {}}
      hitSlop={10}
      onPress={() => checkUserAccess(async () => await addAdFavorites(adId))}
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
