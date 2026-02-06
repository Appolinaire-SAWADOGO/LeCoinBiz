import AuthPagesContainer from "@/components/auth/AuthPagesContainer";
import AppText from "@/components/custom/AppText";
import { useAddUserName } from "@/hooks/services/auth/SignUp/useAddUserName";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import { useAddUsernameModalStore } from "@/store/useAddUsernameModalStore";
import { validateUsername } from "@/utils/auth/validation";
import React from "react";
import { StyleSheet, View } from "react-native";
import AuthFormInputSection from "../auth/form/AuthFormInputSection";
import AuthFormLegalCard from "../auth/form/AuthFormLegalCard";
import AppButton from "../custom/AppButton";
import AppInput from "../custom/input/AppInput";
import AppFullModal from "./AppFullModal";

export default function AuthAddUsernameModal() {
  const { designSystem } = useAppTheme();

  const { isOpen, onClose } = useAddUsernameModalStore();
  const [userName, setUserName] = React.useState("");
  const { addUserName, isLoading, error } = useAddUserName();
  const usernameValidation = validateUsername(userName);

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

        {/* input */}
        <View style={styles.inputsSection}>
          <AuthFormInputSection label="Nom d'utilisateur">
            <AppInput
              placeholder="John Doe"
              model="withBorder"
              value={userName}
              onChangeText={setUserName}
            />
            {error && (
              <AppText color="red" style={{ marginTop: 8 }}>
                {error}
              </AppText>
            )}

            {!error && userName && usernameValidation.error && (
              <AppText style={{ marginTop: 8 }} color="red">
                {usernameValidation.error}
              </AppText>
            )}
          </AuthFormInputSection>
        </View>

        {/* legal card */}
        <AuthFormLegalCard />

        {/* submit button */}
        <AppButton
          title="Suivant"
          textStyle={{ fontSize: 14, fontWeight: "bold" }}
          style={{ marginBottom: 20 }}
          isLoading={isLoading}
          onPress={async () => {
            if (userName && usernameValidation.isValid)
              await addUserName(userName);
          }}
          disabled={isLoading || !userName || !usernameValidation.isValid}
        />
      </AuthPagesContainer>
    </AppFullModal>
  );
}

const styles = StyleSheet.create({
  inputsSection: {
    gap: 20,
    marginBottom: 20,
  },
});
