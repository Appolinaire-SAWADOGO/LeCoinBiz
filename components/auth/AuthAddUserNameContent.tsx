import { useAddUserName } from "@/hooks/services/auth/SignUp/useAddUserName";
import { useBackPress } from "@/hooks/useBackPress";
import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../custom/AppButton";
import AppText from "../custom/AppText";
import AppInput from "../custom/input/AppInput";
import AuthFormInputSection from "./form/AuthFormInputSection";
import AuthFormLegalCard from "./form/AuthFormLegalCard";

export default function AuthAddUserNameContent() {
  const [userName, setUserName] = React.useState("");
  const { addUserName, isLoading, error } = useAddUserName();
  const { onClose } = useAddYourUsernameModalStore();

  useBackPress(() => onClose());

  return (
    <>
      <View style={styles.inputsSection}>
        <AuthFormInputSection label="Nom d'utilisateur">
          <AppInput
            placeholder="John Doe"
            model="withBorder"
            value={userName}
            onChangeText={setUserName}
          />
          {error && (
            <AppText color="red" style={{ marginTop: 10 }}>
              {error}
            </AppText>
          )}
        </AuthFormInputSection>
      </View>

      <AuthFormLegalCard />

      <AppButton
        title="Suivant"
        textStyle={{ fontSize: 14, fontWeight: "bold" }}
        style={{ marginBottom: 20 }}
        isLoading={isLoading}
        onPress={async () => await addUserName(userName)}
        disabled={isLoading || !userName}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputsSection: {
    gap: 20,
    marginBottom: 20,
  },
});
