import AppButton from "@/components/custom/AppButton";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
} from "@/components/ui/modal";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { useAppTheme } from "@/hooks/useAppTheme";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import AppText from "../custom/AppText";

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
    if (tempDate) {
      await editDateOfBirth(tempDate.toDate(), setTempDate);
    }
    setShow(false);
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

      <Modal isOpen={show} onClose={handleCancel} size="md" useRNModal>
        <ModalBackdrop />

        <ModalContent
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.0)",
            width: "100%",
            borderWidth: 0,
          }}
        >
          <ModalBody
            style={{
              backgroundColor: "white",
              margin: 20,
              borderRadius: 20,
              padding: 20,
              width: "100%",
            }}
          >
            <DateTimePicker
              mode="single"
              date={tempDate ?? dayjs()}
              onChange={(params: any) => setTempDate(dayjs(params.date))}
              locale="fr"
              maxDate={dayjs()}
              minDate={dayjs("1900-01-01")}
              styles={{
                selected: {
                  backgroundColor: designSystem.colors.primary,
                  borderRadius: 8,
                  fontWeight: "bold",
                },
                today: {
                  borderWidth: 1.5,
                  borderColor: designSystem.colors.primary,
                  backgroundColor: designSystem.colors.primaryLight,
                  borderRadius: 8,
                  fontWeight: "bold",
                },
                selected_label: {
                  color: "white",
                  fontWeight: "bold",
                },
                day_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                month_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                year_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                weekday_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                month_selector_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                year_selector_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Regular",
                },
                button_next_image: {
                  tintColor: designSystem.colors.primary,
                  aspectRatio: 1.2,
                },
                button_prev_image: {
                  tintColor: designSystem.colors.primary,
                  aspectRatio: 1.2,
                },
                header: {
                  marginBottom: 10,
                },
              }}
            />

            <AppButton
              onPress={handleConfirm}
              style={{
                backgroundColor: designSystem.colors.primary,
                height: 40,
                borderRadius: 8,
                marginTop: 10,
                elevation: 0,
              }}
              textStyle={{ fontSize: 16 }}
              title="Confirmer"
              textWeight="Medium"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
}
