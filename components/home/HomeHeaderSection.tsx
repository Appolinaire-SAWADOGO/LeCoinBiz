import HeaderTexture2 from "@/assets/images/textures/HeaderTexture2.png";
import AppText from "@/components/custom/AppText";
import HomeCategories from "@/components/home/HomeHeaderCategories";
import FilterModal from "@/components/modals/filter-modal/FilterModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCheckUserAcces } from "@/hooks/useCheckUserAcces";
import { router } from "expo-router";
import { BellRing, Search, SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import SectionHeaderText from "../SectionHeaderText";
import {APP_NAME} from "@/constants";

export default function HomeHeaderSection() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { designSystem } = useAppTheme();

  const { checkUserAccess } = useCheckUserAcces();

  return (
    <>
      <View
        style={[
          styles.header,
          { backgroundColor: designSystem.colors.primary },
        ]}
      >
        {/* filter modal */}
        <FilterModal
          useCase={"Home"}
          isOpenProps={isOpen}
          setIsOpenProps={setIsOpen}
        />

        <View>
          {/* texture */}
          <Image style={[styles.headerTexture2]} source={HeaderTexture2} />

          {/* logo */}
          <View style={styles.top}>
            <AppText style={styles.logo} font="Bold">
              {APP_NAME}
            </AppText>
            <TouchableOpacity
              onPress={() =>
                checkUserAccess(() => router.push("/(root)/Notifications"))
              }
              style={styles.notificationIcon}
            >

              <BellRing size={18} color={"#fff"} />
            </TouchableOpacity>
          </View>

          {/* search and filter */}
          <View style={styles.searchRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(root)/Search")}
              style={styles.searchChip}
            >
              <Search size={18} color={designSystem.colors.bigText} />
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
              style={styles.filterButton}
              onPress={() => setIsOpen(true)}
            >
              <SlidersHorizontal
                size={16}
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

        {/* popular categories */}
        <View style={styles.category}>
          <SectionHeaderText name={"Catégories"} withViewAll />
          <HomeCategories />
          <SectionHeaderText
            withViewAll={false}
            name="Annonces Recentes"
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
    // borderTopRightRadius: 14,
    // borderTopLeftRadius: 14,
    gap: 12,
  },
});
