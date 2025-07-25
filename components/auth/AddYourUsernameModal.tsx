import AuthAddUserNameContent from "@/components/auth/AuthAddUserNameContent";
import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import React from "react";
import AppFullModal from "../modals/AppFullModal";

export default function AddYourUsernameModal() {
  const { designSystem } = useAppTheme();

  const { isOpen, onClose } = useAddYourUsernameModalStore();

  useBackPress(() => onClose());

  return (
    <AppFullModal isOpen={isOpen} onClose={onClose}>
      <AuthPagesContainer onBack={onClose}>
        {/* page name */}
        <AppText
          fontSize={28}
          font="Bold"
          color={designSystem.colors.bigText}
          style={{ marginBottom: 32 }}
        >
          Ajoutez un nom d&apos;utilisateur pour continuer
        </AppText>

        <AuthAddUserNameContent />
      </AuthPagesContainer>
    </AppFullModal>
  );
}
