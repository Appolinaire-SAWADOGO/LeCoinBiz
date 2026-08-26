import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { useAppTheme } from "@/hooks/useAppTheme";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import AppText from "../custom/AppText";
import AppDateTimePickerModal from "../modals/date-time-picker-modal/AppDateTimePickerModal";

export default function EditProfileDateOfBirthSection({
  dateOfBirth,
}: {
  dateOfBirth?: Date;
}) {
  const [tempDate, setTempDate] = useState<Dayjs | null>(
    dateOfBirth ? dayjs(dateOfBirth) : null,
  );
  const [show, setShow] = useState(false);
  const { designSystem } = useAppTheme();

  const { editDateOfBirth } = useEditProfile();

  const handleConfirm = async () => {
    setShow(false);
    if (tempDate) {
      await editDateOfBirth(tempDate.toDate(), setTempDate);
    }
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium">Date de naissance</AppText>

      <Pressable
        onPress={() => setShow(true)}
        style={{
          borderBottomWidth: 1,
          borderColor: designSystem.colors.inputBorder,
          borderRadius: 8,
          height: 48,
          backgroundColor: "#fff",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <AppText color={!tempDate ? "rgba(0, 0, 0, 0.5)" : "#000"}>
          {tempDate
            ? tempDate.format("DD/MM/YYYY")
            : "Cliquez pour choisir une date"}
        </AppText>
      </Pressable>

      <AppDateTimePickerModal
        show={show}
        onClose={handleCancel}
        handleConfirm={handleConfirm}
        tempDate={tempDate}
        setTempDate={setTempDate}
        maxDate={dayjs()}
        minDate={dayjs("1900-01-01")}
      />
    </View>
  );
}
