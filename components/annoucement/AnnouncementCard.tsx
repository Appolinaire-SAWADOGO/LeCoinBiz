import AppText from "@/components/custom/AppText";
import { useCheckUserAcces } from "@/hooks/services/auth/useCheckUserAcces";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { Clock3, Eye, Heart, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnnouncementCard({
  id,
  name,
  image,
  price,
  city,
  views,
  useCase = "OtherPage",
  children,
  status,
  type = "primary",
}: {
  id: string;
  name: string;
  image: string;
  price: number;
  city: string;
  views?: number;
  useCase?: "OtherPage" | "ProfilePage";
  children?: React.ReactNode;
  status?: "inSell" | "disabled";
  type?: "similar" | "primary";
}) {
  const [selected, setSelected] = useState(false);

  const { designSystem } = useAppTheme();

  const isSimilarType = type === "similar";

  const { checkUserAccess } = useCheckUserAcces();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push(
          `/(root)/(announcement)/AnnouncementDetails?id=${id}&from=${useCase}${status ? `&status=${status}` : ""}`
        )
      }
      style={[styles.card, { width: isSimilarType ? 208 : 152 }]}
    >
      {/* Favoris button  */}
      {useCase === "OtherPage" && (
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => checkUserAccess(() => setSelected(!selected))}
        >
          <Heart
            size={16}
            color={
              selected
                ? designSystem.colors.primary
                : designSystem.colors.bigText
            }
            fill={selected ? designSystem.colors.primary : "none"}
          />
        </TouchableOpacity>
      )}

      {/* announcement image */}
      <Image source={{ uri: image }} style={styles.image} />

      {/* announcement content */}
      <View style={styles.info}>
        {/* Prix */}
        <AppText fontSize={18} font="Bold" color={designSystem.colors.primary}>
          {price.toLocaleString()} FCFA
        </AppText>

        {/* Titre de l'annonce */}
        <AppText fontSize={13} color={designSystem.colors.bigText}>
          {name}
        </AppText>

        {/* Localisation */}
        <View style={styles.locationRow}>
          <MapPin size={14} color="#888" />
          <AppText fontSize={12} color={designSystem.colors.subText}>
            {city}
          </AppText>
        </View>

        {/* Vues */}
        {useCase === "ProfilePage" && views && (
          <View style={styles.viewsRow}>
            <Eye size={14} color="#888" />
            <AppText fontSize={12} color={designSystem.colors.subText}>
              {views} vues
            </AppText>
          </View>
        )}

        <View style={styles.dateRow}>
          <Clock3 size={14} color="#888" />
          <AppText fontSize={12} color={designSystem.colors.subText}>
            2 days ago
          </AppText>
        </View>

        {children && useCase === "ProfilePage" && children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 16,
  },
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
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 10,
    gap: 4,
  },

  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  dateRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
});
