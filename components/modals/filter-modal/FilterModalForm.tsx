import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { FilterModalUseCaseType } from "@/types";
import { addRecentSearch } from "@/utils";
import { FilterModalFormSchema } from "@/zod/schema/filterModalForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
import AppFullModal from "../AppFullModal";
import FilterModalFormActionButtonSection from "./sections/FilterModalFormActionButtonSection";
import FilterModalFormCategorySection from "./sections/FilterModalFormCategorySection";
import FilterModalFormLocSection from "./sections/FilterModalFormLocSection";
import FilterModalFormOptionsSection from "./sections/FilterModalFormOptionsSection";
import FilterModalFormPriceSection from "./sections/FilterModalFormPriceSection";
import FilterModalFormSeachSection from "./sections/FilterModalFormSeachSection";
import FilterModalFormSubCategorySection from "./sections/FilterModalFormSubCategorySection";
import FilterModalFormTemPubSection from "./sections/FilterModalFormTemPubSection";

type props = {
  isOpen: boolean;
  close: () => void;
  useCase: FilterModalUseCaseType;
};

export default function FilterModalForm({ isOpen, close, useCase }: props) {
  type FormData = z.infer<typeof FilterModalFormSchema>;

  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const filterStatesStore = useFilterStatesStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FilterModalFormSchema),
    defaultValues: {
      search: filterStatesStore.search || "",
      category: filterStatesStore.category || "Toutes les catégories",
      subCategory: filterStatesStore.subCategory || "",
      city: filterStatesStore.city || "Toutes les villes",
      min: filterStatesStore.min || "",
      max: filterStatesStore.max || "",
      tempPub: filterStatesStore.tempPub || "Toutes les annonces",
      options: filterStatesStore.options || [
        { label: "Annonces Populaire", active: false },
        { label: "Livraison Gratuite", active: false },
        { label: "Neuf", active: false },
      ],
    },
  });

  const handleApply = async (data: FormData) => {
    setIsLoading(true);

    const newFilters = {
      search: data.search as string,
      category: data.category,
      subCategory: data.subCategory as string,
      city: data.city,
      min: data.min as string,
      max: data.max as string,
      tempPub: data.tempPub,
      options: data.options,
    };

    filterStatesStore.setFilters(newFilters);

    await addRecentSearch(data.search as string);

    await queryClient.invalidateQueries({
      queryKey: ["filter-ads", newFilters],
    });

    setIsLoading(false);
    close();

    if (useCase === "Home") {
      resetForm();
      router.push("/(root)/Filters");
    }
  };

  const currentCategory = watch("category");

  const insets = useSafeAreaInsets();

  const resetFormValues = () => {
    if (watch("search") !== filterStatesStore.search)
      setValue("search", filterStatesStore.search);
    if (watch("category") !== filterStatesStore.category)
      setValue("category", filterStatesStore.category);
    if (watch("subCategory") !== filterStatesStore.subCategory)
      setValue("subCategory", filterStatesStore.subCategory);
    if (watch("city") !== filterStatesStore.city)
      setValue("city", filterStatesStore.city);
    if (watch("min") !== filterStatesStore.min)
      setValue("min", filterStatesStore.min);
    if (watch("max") !== filterStatesStore.max)
      setValue("max", filterStatesStore.max);
    if (watch("tempPub") !== filterStatesStore.tempPub)
      setValue("tempPub", filterStatesStore.tempPub);
    if (watch("options") !== filterStatesStore.options)
      setValue("options", filterStatesStore.options);
  };

  useEffect(() => {
    setValue("search", filterStatesStore.search);
  }, [filterStatesStore.search, setValue]);

  return (
    <AppFullModal
      isOpen={isOpen}
      onClose={() => {
        resetFormValues();
        close();
      }}
      bgColor={"#fff"}
    >
      <Container>
        <View style={styles.header}>
          <AppText style={styles.title}>Filtrer les annonces</AppText>
          <TouchableOpacity
            onPress={() => {
              resetFormValues();
              close();
            }}
          >
            <X color="#000" />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 20 : 0}
        >
          <ScrollView
            style={{ flex: 1, height: "100%", paddingHorizontal: 20 }}
          >
            {/* search */}
            <Controller
              control={control}
              name="search"
              render={({ field: { onChange, value } }) => (
                <>
                  <FilterModalFormSeachSection
                    search={value}
                    onChange={onChange}
                  />
                  {errors.search && (
                    <AppText style={{ color: "red", marginVertical: 8 }}>
                      {errors.search.message}
                    </AppText>
                  )}
                </>
              )}
            />

            {/* Catégorie */}
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <FilterModalFormCategorySection
                  category={value}
                  setCategory={(value) => {
                    onChange(value);
                    setValue("subCategory", "");
                  }}
                />
              )}
            />

            {/*sub Catégorie */}
            {currentCategory !== "Toutes les catégories" && (
              <Controller
                control={control}
                name="subCategory"
                render={({ field: { onChange, value } }) => (
                  <FilterModalFormSubCategorySection
                    subCategory={value as string}
                    setSubCategory={onChange}
                    category={currentCategory}
                  />
                )}
              />
            )}

            {/* Localisation */}
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <FilterModalFormLocSection city={value} setCity={onChange} />
              )}
            />

            {/* prix */}
            <View>
              <AppText style={styles.label}>Prix minimum / maximum</AppText>
              <View style={styles.priceFilterContainer}>
                <Controller
                  control={control}
                  name="min"
                  render={({ field: { onChange, value } }) => (
                    <FilterModalFormPriceSection
                      onChangeText={onChange}
                      value={value}
                      placeholder="Minimum"
                      maxLength={8}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="max"
                  render={({ field: { onChange, value } }) => (
                    <FilterModalFormPriceSection
                      onChangeText={onChange}
                      value={value}
                      placeholder="Maximum"
                      maxLength={8}
                    />
                  )}
                />
              </View>
              {errors.max && (
                <AppText style={{ color: "red", marginVertical: 8 }}>
                  {errors.max.message}
                </AppText>
              )}
            </View>

            {/* Temps de publication */}
            <Controller
              control={control}
              name="tempPub"
              render={({ field: { onChange, value } }) => (
                <FilterModalFormTemPubSection
                  temPub={value}
                  setTemPub={onChange}
                />
              )}
            />

            {/* Options */}
            <Controller
              control={control}
              name="options"
              render={({ field: { onChange, value } }) => (
                <FilterModalFormOptionsSection onChange={onChange} />
              )}
            />

            {/* Bouton d'action */}
            <FilterModalFormActionButtonSection
              isLoading={isLoading}
              onPress={handleSubmit(async (data) => await handleApply(data))}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </AppFullModal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    marginTop: 14,
  },
  priceFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
