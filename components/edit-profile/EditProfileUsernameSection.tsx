import EditProfileSection from "@/components/edit-profile/EditProfileSection";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { validateUsername } from "@/utils/auth/validation";
import React from "react";

export default function EditProfileUserNameSection({
  userName,
}: {
  userName: string;
}) {
  const [value, setValue] = React.useState<string>(userName);
  const [lastvalue, setLastValue] = React.useState<string>(userName);

  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const { editUserName } = useEditProfile();

  const handleSubmit = async () => {
    const trimmed = value.trim();

    if (lastvalue && trimmed === lastvalue.trim()) {
      return;
    }

    if (!validateUsername(value).isValid) {
      setErrorMsg(validateUsername(value).error!);
      return;
    }

    try {
      setErrorMsg("");
      await editUserName(trimmed, setValue);
      setLastValue(value);
    } catch (error) {
      setErrorMsg("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <EditProfileSection
      label="Nom d'utilisateur"
      placeHolder="johndoe123"
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
