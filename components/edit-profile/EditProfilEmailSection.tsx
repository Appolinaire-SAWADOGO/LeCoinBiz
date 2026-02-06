import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useChangeEmailStore } from "@/store/useChangeEmailStore";
import { useVerifyEmailStore } from "@/store/useVerifyEmailStore";
import { breakTextEvery } from "@/utils";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfilEmailSection({ email }: { email: string }) {
  const { designSystem } = useAppTheme();

  const user = useCurrentUser();
  const emailVerified = user?.emailVerified;

  const { open } = useChangeEmailStore();
  const { open: openVerifyEmailModal } = useVerifyEmailStore();

  return (
    <View style={{ flex: 1 }}>
      <AppText font="Medium">Email</AppText>

      <View
        style={{
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderColor: designSystem.colors.inputBorder,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <View style={{ gap: 10 }}>
          <AppText>{breakTextEvery(email, 21)}</AppText>

          {!emailVerified && (
            <TouchableOpacity onPress={openVerifyEmailModal}>
              <AppText color={designSystem.colors.primary}>
                Vérifier l&lsquo;adresse l&lsquo;e-mail
              </AppText>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={open}
        >
          <AppText>Changer</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
