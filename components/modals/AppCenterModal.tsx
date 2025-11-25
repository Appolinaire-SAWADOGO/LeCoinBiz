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
  onSubmit,
  withCancelButton = true,
  onClose,
  titleSize = "md",
  xSize = "md",
}: {
  title: string;
  submitText: string;
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  onSubmit?: () => void;
  withCancelButton?: boolean;
  onClose?: () => void;
  titleSize?: "xs" | "sm" | "md" | "lg" | "5xl" | "4xl" | "3xl" | "2xl" | "xl";
  xSize?: "lg" | "xs" | "sm" | "md" | "xl" | "2xs";
}) {
  const { designSystem } = useAppTheme();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => (onClose ? onClose() : setIsOpen?.(false))}
      size="md"
      useRNModal
    >
      <ModalBackdrop />
      <ModalContent style={{ backgroundColor: "#fff" }}>
        <ModalHeader>
          <Heading
            style={{
              fontFamily: "BasisGrotesqueArabicPro-Regular",
              color: designSystem.colors.bigText,
            }}
            size={titleSize}
            className="text-typography-950"
          >
            {title}
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size={xSize}
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              style={{ color: designSystem.colors.bigText }}
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter style={footerStyle}>
          {withCancelButton && (
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setIsOpen?.(false);
              }}
              style={{
                width: 100,
              }}
            >
              <ButtonText>Annuler</ButtonText>
            </Button>
          )}
          <Button
            style={{
              backgroundColor: designSystem.colors.primary,
              width: 100,
            }}
            onPress={() => {
              onSubmit?.();
            }}
          >
            <ButtonText style={{ color: "#fff" }}>{submitText}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
