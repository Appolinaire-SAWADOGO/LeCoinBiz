import { useFilterState } from "@/hooks/useFilterState";
import { FilterModalUseCaseType } from "@/types";
import React from "react";
import { StyleSheet } from "react-native";
import FilterModalButton from "./FilterModalButton";
import FilterModalForm from "./FilterModalForm";

export default function FilterModal({
  useCase,
  isOpenProps,
  setIsOpenProps,
}: {
  useCase: FilterModalUseCaseType;
  isOpenProps?: boolean;
  setIsOpenProps?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
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
    isFiltered,
  } = useFilterState();

  const setModalOpen = setIsOpenProps || setIsOpen;
  const isModalOpen = isOpenProps || isOpen;

  return (
    <>
      {/* Filter button */}
      {useCase !== "Home" && (
        <FilterModalButton isFiltered={isFiltered} setIsOpen={setModalOpen} />
      )}

      {/* modal */}
      <FilterModalForm
        useCase={useCase}
        isOpen={isModalOpen}
        setIsOpen={setModalOpen}
        category={category}
        setCategory={setCategory}
        city={city}
        setCity={setCity}
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
        tempPub={tempPub}
        setTempPub={setTempPub}
        options={options}
        setOptions={setOptions}
      />
    </>
  );
}

const styles = StyleSheet.create({});
