import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import AppSearchInput from "@/components/custom/input/AppSearchInput";
import PageHeader from "@/components/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdOptionsPickerType } from "@/types";
import { addRecentSearch } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import AppFullModal from "../AppFullModal";

type filtersType = {
  search: string;
  category: string;
  subCategory: string;
  city: string;
  min: string;
  max: string;
  tempPub: string;
  options: AdOptionsPickerType;
};

export default function FiltersSearchModal({
  isOpen,
  onClose,
  search,
  onRefresh,
  setSearch,
  filters,
}: {
  search: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
  setSearch?: (value: string | void) => void;
  filters: filtersType;
}) {
  const { designSystem } = useAppTheme();

  const queryClient = useQueryClient();

  const [recentsSearchs, setRecentsSearchs] = React.useState<string[]>([]);

  // const { getSuggestionSearchAds } = useGetSuggestionSearchAds();

  const [searchState, setSearchState] = React.useState<string>(search);

  useEffect(() => {
    const getRecentsSearchs = async () => {
      try {
        const results = await AsyncStorage.getItem("recents_searchs");
        setRecentsSearchs(results ? JSON.parse(results) : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des recherches :", error);
      }
    };

    getRecentsSearchs();
  }, []);

  useEffect(() => {
    setSearchState(search);
  }, [search]);

  // const { data, isFetching } = useQuery({
  //   queryKey: ["suggestion-search-ads"],
  //   queryFn: () => getSuggestionSearchAds(searchState),
  // });

  const handleSearch = async (query: string) => {
    if (!query) return;

    setSearch?.(query);

    await addRecentSearch(query);

    onClose();

    await queryClient.invalidateQueries({
      queryKey: ["filter-ads"],
    });
  };

  return (
    <AppFullModal isOpen={isOpen} onClose={onClose}>
      <Container style={{ paddingHorizontal: 20 }}>
        <PageHeader withBackButton={false}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            hitSlop={10}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={designSystem.colors.bigText}
            />
          </TouchableOpacity>

          <AppSearchInput
            search={searchState}
            activeOpacity={0.5}
            setSearch={setSearch}
            onRefresh={onRefresh}
            handleSearch={handleSearch}
            onChangeText={async (text) => {
              setSearchState?.(text);

              // if (!text) return;

              // await queryClient.invalidateQueries({
              //   queryKey: ["suggestion-search-ads"],
              // });
            }}
            onPressX={() => {
              setSearchState?.("");
            }}
          />
        </PageHeader>
        <View style={{ marginTop: 30 }}>
          <AppText font="Bold" fontSize={18} style={{ marginBottom: 12 }}>
            {/* {searchState && data && data.length > 0
              ? "Suggestions de recherches"
              : "Recherches recentes"} */}
            Recherches recentes
          </AppText>

          {/* recents search */}
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            {recentsSearchs.map((recSearch, index) => (
              <TouchableOpacity
                key={index}
                onPress={async () => await handleSearch(recSearch)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: designSystem.colors.inputBorder,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignSelf: "flex-start",
                }}
              >
                <AppText fontSize={13}>{recSearch}</AppText>
                <MaterialCommunityIcons name="arrow-top-right" size={17} />
              </TouchableOpacity>
            ))}
          </View>

          {/* suggestion search */}
          {/* {searchState && data && data.length > 0 && !isFetching && (
            <View style={{ flexDirection: "column", gap: 12 }}>
              {data?.map((sugSearch, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => await handleSearch(sugSearch)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                  }}
                >
                  <AppText fontSize={13}>{sugSearch}</AppText>
                  <MaterialCommunityIcons name="arrow-top-right" size={17} />
                </TouchableOpacity>
              ))}
            </View>
          )} */}
        </View>
      </Container>
    </AppFullModal>
  );
}
