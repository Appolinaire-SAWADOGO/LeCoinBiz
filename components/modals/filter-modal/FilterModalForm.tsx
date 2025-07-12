import { AdOptionsPickerType, FilterModalUseCaseType } from "@/types";
import React from "react";
import AppBottomModal from "../AppBottomModal";
import FilterModalFormActionButton from "./FilterModalFormActionButton";
import FilterModalFormCategorySection from "./sections/FilterModalFormCategorySection";
import FilterModalFormLocSection from "./sections/FilterModalFormLocSection";
import FilterModalFormOptionsSection from "./sections/FilterModalFormOptionsSection";
import FilterModalFormPriceMinMaxSection from "./sections/FilterModalFormPriceMinMaxSection";
import FilterModalFormTemPubSection from "./sections/FilterModalFormTemPubSection";

type props = {
  useCase: FilterModalUseCaseType;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  min: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  max: string;
  setMax: React.Dispatch<React.SetStateAction<string>>;
  tempPub: string;
  setTempPub: React.Dispatch<React.SetStateAction<string>>;
  options: AdOptionsPickerType;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
};

export default function FilterModalForm({
  useCase,
  isOpen,
  setIsOpen,
  category,
  setCategory,
  city,
  setCity,
  min,
  setMin,
  max,
  setMax,
  tempPub,
  setTempPub,
  options,
  setOptions,
}: props) {
  return (
    <AppBottomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      headerText="Filtrer les annonces"
    >
      {/* Catégorie */}
      <FilterModalFormCategorySection
        useCase={useCase}
        category={category}
        setCategory={setCategory}
      />

      {/* Localisation */}
      <FilterModalFormLocSection city={city} setCity={setCity} />

      {/* Prix */}
      <FilterModalFormPriceMinMaxSection
        min={min}
        max={max}
        setMin={setMin}
        setMax={setMax}
      />

      {/* Temps de publication */}
      <FilterModalFormTemPubSection temPub={tempPub} setTemPub={setTempPub} />

      {/* Options */}
      <FilterModalFormOptionsSection
        options={options}
        setOptions={setOptions}
      />

      {/* Bouton d'action */}
      <FilterModalFormActionButton setIsOpen={setIsOpen} />
    </AppBottomModal>
  );
}
