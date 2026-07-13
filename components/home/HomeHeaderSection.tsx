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
import HeaderTexture1 from "../../assets/images/textures/HeaderTexture1.png";
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
  const { hasNotifications, setHasNotifications } = useNotificationStore();

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

  return (
    <>
      <FilterModalForm isOpen={isOpen} close={close} useCase={"Home"} />

      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: designSystem.colors.primary },
        ]}
      >
        {/* texture */}
        <Image style={styles.headerTexture1} source={HeaderTexture1} />
        <Image style={[styles.headerTexture2]} source={HeaderTexture2} />

        {/* Search pill */}
        <View style={styles.searchPill}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              router.navigate("/(root)/Filters");
              await queryClient.invalidateQueries({
                queryKey: ["filter-ads", filters],
              });
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              // width: "50%",
              // borderRightWidth: 1,
              // borderRightColor: "#ddd",
              // backgroundColor: designSystem.colors.primary,
              paddingLeft: 16,
              paddingVertical: 10,
            }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={designSystem.colors.bigText}
            />
            <AppText
              style={styles.searchText}
              font="Medium"
              color={designSystem.colors.bigText}
            >
              {APP_NAME}
            </AppText>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            onPress={() => openFilterModal()}
            style={[
              styles.filterInner,
              {
                // width: "50%",
                // flex: 1,
                justifyContent: "flex-end",
                // backgroundColor: "red",
                paddingRight: 16,
                paddingLeft: 10,
                paddingVertical: 10,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="tune"
              size={18}
              color={designSystem.colors.bigText}
            />
            <AppText
              style={styles.filterLabel}
              font="Medium"
              color={designSystem.colors.bigText}
            >
              Filtrer
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Bell */}
        <TouchableOpacity
          onPress={() => {
            setHasNotifications(false);
            router.navigate("/(root)/Notifications");
          }}
          style={[
            styles.iconBtn,
            { backgroundColor: designSystem.colors.primaryLight },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-ring-outline"
            size={20}
            color="#fff"
          />
          {hasNotifications && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      {/* ── Categories ── */}
      <View style={styles.categoryBar}>
        <SectionHeaderText
          name="Catégories"
          withViewAll
          style={{ paddingHorizontal: 20, paddingBottom: 10 }}
        />
        <HomeCategories />
      </View>

      {/* ── Section title ── */}
      <View style={styles.sectionTitle}>
        <SectionHeaderText
          withViewAll={false}
          name="Annonces récentes"
          style={{ marginBottom: 0 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 50,
    paddingBottom: 16,
    gap: 10,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  searchPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 30,
    // paddingVertical: 10,
    // paddingHorizontal: 16,
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
  divider: {
    width: 1,
    height: 22,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  filterInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  filterLabel: {
    fontSize: 15,
  },
  categoryBar: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionTitle: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 5,
  },
  headerTexture2: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 0,
    width: 70,
  },
  headerTexture1: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 0,
  },
});
