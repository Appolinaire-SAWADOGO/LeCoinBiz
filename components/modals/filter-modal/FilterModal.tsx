import { useFilterStatesStore } from "@/store/useFilterStatesStore";
import { FilterModalUseCaseType } from "@/types";
import React from "react";
import FilterModalButton from "./FilterModalButton";
import FilterModalForm from "./FilterModalForm";

export default function FilterModal({
  useCase,
}: {
  useCase: FilterModalUseCaseType;
}) {
  const { isOpen, close, open, isFiltered } = useFilterStatesStore();

  return (
    <>
      {/* Filter button */}
      {useCase !== "Home" && (
        <FilterModalButton
          isFiltered={isFiltered}
          open={open}
          useCase={useCase}
          // userOrAdValue={userOrAdValue}
          // setUserOrAdvalue={setUserOrAdvalue}
        />
      )}

      {/* modal */}
      <FilterModalForm isOpen={isOpen} close={close} useCase={useCase} />
    </>
  );
}
