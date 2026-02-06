import EditProfileSection from "@/components/edit-profile/EditProfileSection";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { validateFirstAndLastname } from "@/utils/auth/validation";
import React from "react";

export default function EditProfileFirstAndLastNameSection({
  firstAndLastName,
}: {
  firstAndLastName: string;
}) {
  const [value, setValue] = React.useState<string>(firstAndLastName);
  const [lastvalue, setLastValue] = React.useState<string>(firstAndLastName);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const { editFirstAndLastName } = useEditProfile();

  const handleSubmit = async () => {
    const trimmed = value.trim();

    if (lastvalue && trimmed === lastvalue.trim()) {
      return;
    }

    if (!validateFirstAndLastname(value).isValid) {
      setErrorMsg(validateFirstAndLastname(value).error!);
      return;
    }

    try {
      setErrorMsg("");
      await editFirstAndLastName(trimmed, setValue);
      setLastValue(value);
    } catch (error) {
      setErrorMsg("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <EditProfileSection
      label="Nom & Prenom"
      placeHolder="John Doe"
      value={value}
      errorMsg={errorMsg}
      onChange={(text) => {
        setValue(text);
        if (errorMsg) setErrorMsg("");
      }}
      onSubmitEditing={handleSubmit}
    />
  );
}
