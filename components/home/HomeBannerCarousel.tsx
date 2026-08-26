import { BannerType } from "@/functions/types";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Container from "../Container";
import AppText from "../custom/AppText";
import AppFullModal from "../modals/AppFullModal";
import PageHeader from "../PageHeader";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

// const CAR_IMAGES: BrandBanner[] = [
//   {
//     id: "1",
//     image:
//       "https://www.moussonews.com/wp-content/uploads/2024/12/470135868_1043327784492903_5345965022174911431_n-768x543.jpg",
//     title: "Marque Premium",
//     description:
//       "Découvrez notre collection exclusive de produits de haute qualité. Nous offrons les meilleures sélections pour vos besoins.",
//     contact: {
//       phone: "76 12 34 56",
//       email: "contact@marque-premium.bf",
//       website: "www.marque-premium.bf",
//       address: "Ouagadougou, Burkina Faso",
//     },
//   },
//   {
//     id: "2",
//     image:
//       "https://tse4.mm.bing.net/th/id/OIP.5HvQbPv7FgCpMg5TuFJnkAHaEL?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
//     title: "Marque Élite",
//     description:
//       "Profitez de nos offres spéciales et promotions exceptionnelles toute l'année. Qualité garantie et service clientèle excellent.",
//     contact: {
//       phone: "78 98 76 54",
//       email: "info@marque-elite.bf",
//       website: "www.marque-elite.bf",
//       address: "Bobo-Dioulasso, Burkina Faso",
//     },
//   },
// ];

export function HomeBannerCarousel({
  bannersData,
}: {
  bannersData: BannerType[];
}) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carrourelBannerDetailModalOpen, setCarrourelBannerOpen] =
    useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % bannersData.length;
      scrollRef.current?.scrollTo({
        x: indexRef.current * BANNER_WIDTH,
        animated: true,
      });
      setActiveIndex(indexRef.current);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    indexRef.current = newIndex;
    setActiveIndex(newIndex);
  };

  return (
    <>
      <AppFullModal
        isOpen={carrourelBannerDetailModalOpen}
        onClose={() => setCarrourelBannerOpen(false)}
        style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      >
        <Container style={{ paddingHorizontal: 20 }}>
          <PageHeader
            onBack={() => setCarrourelBannerOpen(false)}
            name="Details"
          />

          <Image
            source={{ uri: bannersData[selectedIndex].image }}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
              marginTop: 15,
            }}
            resizeMode="stretch"
          />

          <View style={styles.brandDetailsContainer}>
            <AppText style={styles.brandTitle} font={"Bold"}>
              {bannersData[selectedIndex].title}
            </AppText>

            <AppText style={styles.brandDescription}>
              {bannersData[selectedIndex].description}
            </AppText>

            <View>
              <AppText style={styles.contactTitle} font={"Medium"}>
                Informations de Contact
              </AppText>

              {bannersData[selectedIndex].contact.phone && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    Linking.openURL(
                      `tel:+226${bannersData[selectedIndex].contact.phone!.replace(/\D/g, "")}`,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Appeler ${bannersData[selectedIndex].contact.phone}`}
                >
                  <AppText style={styles.contactValue}>
                    Numéro de téléphone :{" "}
                    {bannersData[selectedIndex].contact.phone}
                  </AppText>
                </TouchableOpacity>
              )}

              {bannersData[selectedIndex].contact.email && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    Linking.openURL(
                      `mailto:${bannersData[selectedIndex].contact.email}`,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Envoyer un email à ${bannersData[selectedIndex].contact.email}`}
                >
                  <AppText style={styles.contactValue}>
                    Email : {bannersData[selectedIndex].contact.email}
                  </AppText>
                </TouchableOpacity>
              )}

              {bannersData[selectedIndex].contact.website && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    Linking.openURL(
                      bannersData[selectedIndex].contact.website &&
                        bannersData[selectedIndex].contact.website.startsWith(
                          "http",
                        )
                        ? bannersData[selectedIndex].contact.website
                        : `https://${bannersData[selectedIndex].contact.website}`,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Ouvrir le site ${bannersData[selectedIndex].contact.website}`}
                >
                  <AppText style={styles.contactValue}>
                    Site Web : {bannersData[selectedIndex].contact.website}
                  </AppText>
                </TouchableOpacity>
              )}

              {bannersData[selectedIndex].contact.address && (
                <View style={styles.contactItem}>
                  <AppText style={styles.contactLabel}>
                    Adresse : {bannersData[selectedIndex].contact.address}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </Container>
      </AppFullModal>

      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          style={{
            width: BANNER_WIDTH,
            height: BANNER_HEIGHT,
            borderRadius: 12,
          }}
        >
          {bannersData.map((banner, i) => (
            <TouchableOpacity
              key={banner.id}
              onPress={() => {
                setCarrourelBannerOpen(true);
                setSelectedIndex(i);
              }}
            >
              <Image
                source={{ uri: banner.image }}
                style={{
                  width: BANNER_WIDTH,
                  height: BANNER_HEIGHT,
                  borderRadius: 12,
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {bannersData.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D1D1",
  },
  dotActive: {
    backgroundColor: "#333",
    width: 16,
  },
  brandDetailsContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    color: "#333",
    marginBottom: 10,
  },
  brandDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 18,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  contactItem: {
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    color: "#333",
  },
});
