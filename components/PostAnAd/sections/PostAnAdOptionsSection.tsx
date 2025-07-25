import AppAdOptionsPicker from "@/components/custom/picker/AppAdOptionsPicker";
import { adOptions } from "@/constants";
import { AdOptionsPickerType } from "@/types";
import React from "react";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdOptionsSection({
  options,
  setOptions,
}: {
  options: AdOptionsPickerType;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
}) {
  return (
    <PostAnAdSection label="Options">
      <AppAdOptionsPicker
        items={adOptions}
        options={options}
        setOptions={setOptions}
      />
    </PostAnAdSection>
  );
}
