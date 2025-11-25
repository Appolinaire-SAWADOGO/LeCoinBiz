import AppAdOptionsPicker from "@/components/custom/picker/AppAdOptionsPicker";
import { AD_OPTIONS } from "@/constants";
import { AdOptionsPickerType } from "@/types";
import React from "react";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdOptionsSection({
  value,
  onChange,
}: {
  value: AdOptionsPickerType;
  onChange: (options: AdOptionsPickerType) => void;
}) {
  const [options, setOptions] = React.useState<AdOptionsPickerType>(
    value || [
      {
        label: "Livraison Gratuite",
        active: false,
      },
      {
        label: "Neuf",
        active: false,
      },
    ]
  );

  React.useEffect(() => {
    onChange(options);
  }, [onChange, options]);

  return (
    <PostAnAdSection label="Options">
      <AppAdOptionsPicker
        items={AD_OPTIONS}
        options={options}
        setOptions={setOptions}
      />
    </PostAnAdSection>
  );
}
