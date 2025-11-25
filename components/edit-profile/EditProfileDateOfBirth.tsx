import AppButton from "@/components/custom/AppButton";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
} from "@/components/ui/modal";
import { useAppTheme } from "@/hooks/useAppTheme";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import AppText from "../custom/AppText";

export default function EditProfileDateOfBirth({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
}) {
  const [tempDate, setTempDate] = useState<Dayjs | null>(
    value ? dayjs(value) : null
  );
  const [show, setShow] = useState(false);
  const { designSystem } = useAppTheme();

  const handleConfirm = () => {
    if (tempDate) {
      onChange(tempDate.toDate());
    }
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value ? dayjs(value) : null);
    setShow(false);
  };

  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium" fontSize={15}>
        Date de naissance
      </AppText>

      <Pressable
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: designSystem.colors.inputBorder,
          borderRadius: 8,
          height: 48,
          backgroundColor: "#fff",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingHorizontal: 14,
        }}
      >
        <AppText color={!value ? "rgba(0, 0, 0, 0.5)" : "#000"}>
          {value
            ? dayjs(value).format("DD/MM/YYYY")
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
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
                },
                month_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
                },
                year_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
                },
                weekday_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
                },
                month_selector_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
                },
                year_selector_label: {
                  fontFamily: "BasisGrotesqueArabicPro-Medium",
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
              textWeight="Bold"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
}
