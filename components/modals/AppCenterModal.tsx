import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

export default function AppCenterModal({
  title,
  submitText,
  isOpen,
  setIsOpen,
  children,
  footerStyle,
}: {
  title: string;
  submitText: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
}) {
  const { designSystem } = useAppTheme();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading
            style={{ fontFamily: "BasisGrotesqueArabicPro-Regular" }}
            size="md"
            className="text-typography-950"
          >
            {title}
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter style={footerStyle}>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setIsOpen(false);
            }}
          >
            <ButtonText>Annuler</ButtonText>
          </Button>
          <Button
            style={{
              backgroundColor: designSystem.colors.primary,
            }}
            onPress={() => {
              setIsOpen(false);
            }}
          >
            <ButtonText>{submitText}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
