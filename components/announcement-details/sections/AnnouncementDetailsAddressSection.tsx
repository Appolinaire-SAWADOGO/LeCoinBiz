import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export type AdAddress = {
  lat: number;
  lng: number;
  formattedAddress: string;
};

type Props = {
  address?: AdAddress;
};

export default function AnnouncementDetailsAddressSection({ address }: Props) {
  if (!address) return null;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`;
    Linking.openURL(url);
  };

  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText
        fontSize={16}
        font="Medium"
        color={designSystem.colors.bigText}
        style={styles.title}
      >
        Localisation
      </AppText>

      <AppText style={styles.addressText} numberOfLines={2}>
        {address.formattedAddress}
      </AppText>

      <Pressable onPress={openInMaps} style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          initialRegion={{
            latitude: address.lat,
            longitude: address.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: address.lat, longitude: address.lng }}
          />
        </MapView>

        <View style={styles.overlayBadge}>
          <Ionicons name="open-outline" size={14} color="#1A1A1A" />
          <AppText style={styles.overlayBadgeText}>Ouvrir dans Maps</AppText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: -20,
    paddingVertical: 16,
    borderColor: "#E5E5E5",
    borderTopWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  title: {
    marginBottom: 10,
  },
  addressText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    height: 170,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  overlayBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  overlayBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
