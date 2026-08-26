import AppButton from "@/components/custom/AppButton";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
} from "@/components/ui/modal";
import { useAppTheme } from "@/hooks/useAppTheme";
import dayjs from "dayjs";
import React from "react";
import DateTimePicker from "react-native-ui-datepicker";

export default function AppDateTimePickerModal({
  show,
  onClose,
  handleConfirm,
  tempDate,
  setTempDate,
  maxDate,
  minDate,
  timePicker = false,
}: {
  show: boolean;
  onClose: () => void;
  handleConfirm: () => Promise<void> | void;
  tempDate: dayjs.Dayjs | null;
  setTempDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  maxDate?: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  timePicker?: boolean;
}) {
  const { designSystem } = useAppTheme();

  return (
    <Modal isOpen={show} onClose={onClose} size="md" useRNModal>
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
            timePicker
            date={tempDate ?? dayjs()}
            onChange={(params: any) => setTempDate(dayjs(params.date))}
            locale="fr"
            maxDate={maxDate}
            minDate={minDate}
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
  );
}
