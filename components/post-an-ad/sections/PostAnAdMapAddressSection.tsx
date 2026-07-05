import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { extractCityFromPlaceDetails } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { MapType, Marker, Region } from "react-native-maps";

const PLACES_API_KEY = process.env.EXPO_PUBLIC_PLACES_API_KEY;

export type MapAddress = {
  lat: number;
  lng: number;
  formattedAddress: string;
};

type Props = {
  value?: MapAddress;
  onChange: (value: MapAddress | undefined) => void;
  onCityDetected?: (city: string) => void;
  optional?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_REGION: Region = {
  latitude: 12.3714,
  longitude: -1.5197,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Satellite = hybride en interne (satellite + routes + noms de lieux)
const MAP_TYPES: {
  type: MapType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { type: "standard", label: "Plan", icon: "map-outline" },
  { type: "hybrid", label: "Satellite", icon: "globe-outline" },
  { type: "terrain", label: "Terrain", icon: "layers-outline" },
];

export default function PostAnAdMapAddressSection({
  value,
  onChange,
  onCityDetected,
  optional = true,
  style,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState<Region>(
    value
      ? {
          latitude: value.lat,
          longitude: value.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : DEFAULT_REGION,
  );
  const [pendingCoords, setPendingCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: region.latitude, longitude: region.longitude });
  const [pendingAddress, setPendingAddress] = useState<string>(
    value?.formattedAddress ?? "",
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const [showMapTypePicker, setShowMapTypePicker] = useState(false);
  const currentMapType = MAP_TYPES[mapTypeIndex].type;

  const [detectedCity, setDetectedCity] = useState<string | undefined>();

  const { designSystem } = useAppTheme();

  const updateDetectedCity = (city?: string) => {
    if (!city) return;
    setDetectedCity(city);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsResolvingAddress(true);
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      const first = results?.[0];
      if (first) {
        const parts = [
          first.name,
          first.street,
          first.district,
          first.city,
          first.country,
        ].filter(Boolean);
        setPendingAddress(parts.join(", "));
        updateDetectedCity(first.city ?? undefined);
      } else {
        setPendingAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch {
      setPendingAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const moveMapTo = (latitude: number, longitude: number, delta = 0.01) => {
    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
    setRegion(newRegion);
    setPendingCoords({ latitude, longitude });
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  const openModal = async () => {
    setModalVisible(true);
    if (!value) {
      await useCurrentLocation();
    }
  };

  const useCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsLocating(false);
        return;
      }

      // 1. Tente d'abord la dernière position connue (quasi instantané)
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 60000, // accepte une position vieille de moins d'1 min
      });
      if (lastKnown) {
        const { latitude, longitude } = lastKnown.coords;
        moveMapTo(latitude, longitude);
        reverseGeocode(latitude, longitude); // pas de await, ça se met à jour dès que prêt
      }

      // 2. En parallèle, tente d'affiner avec la position actuelle, avec timeout
      const currentPositionPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // beaucoup plus rapide que High/Highest
      });

      const timeoutPromise = new Promise<null>(
        (resolve) => setTimeout(() => resolve(null), 8000), // abandonne après 8s
      );

      const position = await Promise.race([
        currentPositionPromise,
        timeoutPromise,
      ]);

      if (position) {
        const { latitude, longitude } = position.coords;
        moveMapTo(latitude, longitude);
        await reverseGeocode(latitude, longitude);
      }
    } catch {
      // silencieux : si lastKnown a déjà positionné la carte, l'utilisateur peut ajuster manuellement
    } finally {
      setIsLocating(false); // garanti d'être appelé même en cas de timeout
    }
  };
  const onMapPress = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingCoords({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const onMarkerDragEnd = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingCoords({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const confirmLocation = () => {
    onChange({
      lat: pendingCoords.latitude,
      lng: pendingCoords.longitude,
      formattedAddress: pendingAddress,
    });
    if (detectedCity && onCityDetected) {
      onCityDetected(detectedCity);
    }
    setModalVisible(false);
  };

  const clearLocation = () => {
    onChange(undefined);
  };

  return (
    <View style={style}>
      <View style={styles.labelRow}>
        <AppText font="Medium" style={styles.label}>
          Adresse sur la carte
        </AppText>
        {optional && <AppText style={styles.optionalTag}>optionnelle</AppText>}
      </View>

      <Pressable style={styles.fieldBox} onPress={openModal}>
        {value ? (
          <View style={{ flex: 1 }}>
            <AppText numberOfLines={2} style={styles.fieldValueText}>
              {value.formattedAddress}
            </AppText>
            <AppText
              style={[styles.editText, { color: designSystem.colors.subText }]}
            >
              Modifier l'emplacement
            </AppText>
          </View>
        ) : (
          <AppText style={styles.placeholderText}>
            Sélectionnez l'adresse sur la carte
          </AppText>
        )}
      </Pressable>

      {value && (
        <Pressable onPress={clearLocation} style={{ marginTop: 6 }}>
          <AppText style={styles.removeText}>Retirer l'adresse</AppText>
        </Pressable>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={region}
            mapType={currentMapType}
            onPress={(e) => {
              setShowMapTypePicker(false);
              onMapPress(e);
            }}
          >
            <Marker
              coordinate={pendingCoords}
              draggable
              onDragEnd={onMarkerDragEnd}
            />
          </MapView>

          {/* Barre de recherche avec autocomplete */}
          <View style={styles.searchWrapper}>
            <GooglePlacesAutocomplete
              placeholder="Rechercher un lieu, une ville..."
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  const { lat, lng } = details.geometry.location;
                  moveMapTo(lat, lng, 0.02);
                  setPendingAddress(
                    details.formatted_address ?? data.description,
                  );
                  updateDetectedCity(extractCityFromPlaceDetails(details));
                  setIsResolvingAddress(false);
                }
              }}
              query={{
                key: PLACES_API_KEY,
                language: "fr",
                components: "country:bf",
              }}
              styles={{
                container: { flex: 0 },
                textInput: styles.searchInput,
                listView: styles.searchListView,
                row: styles.searchRow,
                description: styles.searchDescription,
              }}
              enablePoweredByContainer={false}
              debounce={300}
              minLength={2}
            />
          </View>

          {/* Barre du haut : fermer + position actuelle */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.topBarButton}
            >
              <AppText style={styles.topBarButtonText}>Annuler</AppText>
            </Pressable>

            <Pressable
              onPress={useCurrentLocation}
              style={styles.topBarButton}
              disabled={isLocating}
            >
              {isLocating ? (
                <ActivityIndicator size="small" />
              ) : (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Ionicons name="locate" size={16} />
                  <AppText style={styles.topBarButtonText}>Ma position</AppText>
                </View>
              )}
            </Pressable>
          </View>

          {/* Bouton flottant : type de carte (clairement identifiable) */}
          <View style={styles.mapTypeFab}>
            {showMapTypePicker && (
              <View style={styles.mapTypeMenu}>
                <AppText style={styles.mapTypeMenuTitle}>
                  Affichage de la carte
                </AppText>
                {MAP_TYPES.map((item, index) => (
                  <Pressable
                    key={item.type}
                    style={[
                      styles.mapTypeOption,
                      mapTypeIndex === index && {
                        backgroundColor: designSystem.colors.primaryLight,
                      },
                    ]}
                    onPress={() => {
                      setMapTypeIndex(index);
                      setShowMapTypePicker(false);
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={
                        mapTypeIndex === index
                          ? designSystem.colors.primary
                          : "#000"
                      }
                    />
                    <AppText
                      style={[
                        styles.mapTypeOptionText,
                        mapTypeIndex === index && {
                          fontWeight: "600",
                          color: designSystem.colors.primary,
                        },
                      ]}
                    >
                      {item.label}
                    </AppText>
                    {mapTypeIndex === index && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={designSystem.colors.primary}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            <Pressable
              style={styles.mapTypeFabButton}
              onPress={() => setShowMapTypePicker((prev) => !prev)}
            >
              <Ionicons name="layers" size={20} />
              <AppText style={styles.mapTypeFabLabel}>
                {MAP_TYPES[mapTypeIndex].label}
              </AppText>
            </Pressable>
          </View>

          {/* Barre du bas : adresse + confirmer */}
          <View style={styles.bottomBar}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.bottomBarLabel}>
                Position sélectionnée
              </AppText>
              {isResolvingAddress ? (
                <ActivityIndicator size="small" style={{ marginTop: 4 }} />
              ) : (
                <AppText numberOfLines={2} style={styles.bottomBarAddress}>
                  {pendingAddress || "Déplacez le pin sur votre boutique"}
                </AppText>
              )}
            </View>

            <Pressable
              style={[
                styles.confirmButton,
                { backgroundColor: designSystem.colors.primary },
              ]}
              onPress={confirmLocation}
              disabled={isResolvingAddress}
            >
              <AppText style={styles.confirmButtonText}>Confirmer</AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: { fontSize: 15 },
  optionalTag: { fontSize: 12, color: "#999" },
  fieldBox: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    minHeight: 52,
    justifyContent: "center",
  },
  placeholderText: { fontSize: 14, color: "#999" },
  fieldValueText: { fontSize: 14 },
  editText: { fontSize: 12, marginTop: 4 },
  removeText: { fontSize: 12, color: "#C62828" },
  searchWrapper: {
    position: "absolute",
    top: 100,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    fontSize: 14,
    paddingHorizontal: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchListView: { borderRadius: 10, marginTop: 4, elevation: 4 },
  searchRow: { paddingVertical: 10, paddingHorizontal: 14 },
  searchDescription: { fontSize: 13, color: "#1A1A1A" },
  topBar: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 5,
  },
  topBarButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  topBarButtonText: { fontSize: 13 },
  mapTypeFab: {
    position: "absolute",
    right: 16,
    bottom: 130,
    alignItems: "flex-end",
    zIndex: 8,
  },
  mapTypeFabButton: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  mapTypeFabLabel: { fontSize: 13, fontWeight: "600" },
  mapTypeMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    width: 190,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  mapTypeMenuTitle: {
    fontSize: 11,
    color: "#999",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  mapTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mapTypeOptionText: { fontSize: 14, flex: 1 },
  bottomBar: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bottomBarLabel: { fontSize: 11, color: "#999" },
  bottomBarAddress: { fontSize: 13, marginTop: 2 },
  confirmButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  confirmButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
