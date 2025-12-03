import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import React from "react";
import { ColorValue, StyleProp, StyleSheet } from "react-native";

export default function AppFullModal({
  children,
  bgColor = "#fff",
  isOpen,
  onClose,
  style,
}: {
  children: React.ReactNode;
  bgColor?: ColorValue;
  isOpen: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        style={[
          styles.modal,
          {
            backgroundColor: bgColor || "transparent",
          },
          style,
        ]}
      >
        {children}
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    inset: 0,
    margin: 0,
    paddingBottom: 5,
    borderWidth: 0,
    paddingTop: 0,
    padding: 0,
  },
});
