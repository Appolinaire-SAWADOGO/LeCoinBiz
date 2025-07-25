import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import React from "react";
import { ColorValue } from "react-native";

export default function AppFullModal({
  children,
  bgColor = "#fff",
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  bgColor?: ColorValue;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          borderWidth: 0,
          backgroundColor: bgColor || "transparent",
        }}
      >
        {children}
      </ModalContent>
    </Modal>
  );
}
