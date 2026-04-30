import HeaderTexture2 from "@/assets/images/textures/HeaderTexture2.png";
import AppText from "@/components/custom/AppText";
import HomeCategories from "@/components/home/HomeHeaderCategories";
import { APP_NAME } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import SectionHeaderText from "../SectionHeaderText";
import FilterModalForm from "../modals/filter-modal/FilterModalForm";

export default function HomeHeaderSection() {
  const {
    open: openFilterModal,
    isOpen,
    close,
    search,
    category,
    subCategory,
    city,
    min,
    max,
    tempPub,
    options,
  } = useFilterStatesStore();

  const { designSystem } = useAppTheme();

  const queryClient = useQueryClient();

  const filters = {
    search,
    category,
    subCategory,
    city,
    min,
    max,
    tempPub,
    options,
  };

  const { hasNotifications, setHasNotifications } = useNotificationStore();

  return (
    <>
      <View
        style={[
          styles.header,
          { backgroundColor: designSystem.colors.primary },
        ]}
      >
        {/* filter modal */}
        <FilterModalForm isOpen={isOpen} close={close} useCase={"Home"} />

        <View>
          {/* texture */}
          <Image style={[styles.headerTexture2]} source={HeaderTexture2} />

          {/* logo */}
          <View style={styles.top}>
            <AppText style={styles.logo} font="Bold">
              {APP_NAME}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setHasNotifications(false);
                router.navigate("/(root)/Notifications");
              }}
              style={styles.notificationIcon}
            >
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={18}
                color={"#fff"}
              />

              {/* Badge */}
              {hasNotifications && <View style={styles.dot} />}
            </TouchableOpacity>
          </View>

          {/* search and filter */}
          <View style={styles.searchRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                router.navigate("/(root)/Filters");

                await queryClient.invalidateQueries({
                  queryKey: ["filter-ads", filters],
                });
              }}
              style={styles.searchChip}
            >
              <MaterialCommunityIcons
                name="magnify"
                color={designSystem.colors.bigText}
                size={20}
              />
              <AppText
                style={[
                  styles.searchText,
                  { color: designSystem.colors.bigText },
                ]}
              >
                Rechercher une annonce
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton]}
              onPress={() => openFilterModal()}
            >
              <MaterialCommunityIcons
                name="tune"
                size={18}
                color={designSystem.colors.bigText}
              />
              <AppText
                style={[
                  styles.filterText,
                  { color: designSystem.colors.bigText },
                ]}
              >
                Filtrer
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/*categories */}
        <View style={styles.category}>
          <SectionHeaderText name={"Catégories"} withViewAll />
          <HomeCategories />
          <SectionHeaderText
            withViewAll={false}
            name={"Annonces récentes"}
            style={{ marginBottom: 0 }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerTexture2: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  header: {},
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 100,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: "#6C27B8",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    color: "#fff",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  searchText: {
    fontSize: 15,
    marginLeft: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
  },
  category: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 7,
    paddingHorizontal: 20,
    gap: 12,
  },
  dot: {
    position: "absolute",
    top: 1,
    right: 3,
    width: 7.5,
    height: 7.5,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
});
