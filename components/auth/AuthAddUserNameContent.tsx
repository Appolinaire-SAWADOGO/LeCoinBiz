import { useAddUserName } from "@/hooks/firebase/auth/SignUp/useAddUserName";
import { useBackPress } from "@/hooks/useBackPress";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../custom/AppButton";
import AppInput from "../custom/input/AppInput";
import AuthFormInputSection from "./form/AuthFormInputSection";
import AuthFormLegalCard from "./form/AuthFormLegalCard";

export default function AuthAddUserNameContent() {
  const [userName, setUserName] = React.useState("");

  const { addUserName, isLoading } = useAddUserName();

  useBackPress(() => router.dismiss());

  return (
    <>
      {/* inputs sections */}
      <View style={styles.inputsSection}>
        {/* user name */}
        <AuthFormInputSection label="Nom d'utilisateur">
          <AppInput
            placeholder="John Doe"
            model="withBorder"
            value={userName}
            onChangeText={setUserName}
          />
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
