import Container from "@/components/Container";
import EditProfileDateOfBirthSection from "@/components/edit-profile/EditProfileDateOfBirthSection";
import EditProfileFirstAndLastNameSection from "@/components/edit-profile/EditProfileFirstAndLastNameSection";
import EditProfileGenderSection from "@/components/edit-profile/EditProfileGenderSection";
import EditProfileImageSection from "@/components/edit-profile/EditProfileImageSection";
import EditProfilEmailSection from "@/components/edit-profile/EditProfilEmailSection";
import EditProfilePasswordSection from "@/components/edit-profile/EditProfilePasswordSection";
import EditProfileUserNameSection from "@/components/edit-profile/EditProfileUsernameSection";
import PageHeader from "@/components/PageHeader";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { ProfileSchema } from "@/zod/schema/Profile.schema";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import z from "zod";

type FormData = z.infer<typeof ProfileSchema>;

export default function EditProfile() {
  const { designSystem } = useAppTheme();

  const { user } = useLocalSearchParams();

  const parseUser = JSON.parse(user as string) as UserType;

  const currentUser = useCurrentUser();

  return (
    <Container withBottom style={{ flex: 1 }}>
      <PageHeader
        name="Modifier le profile"
        style={{ paddingHorizontal: 20 }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            gap: 32,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* image */}
          <EditProfileImageSection userImg={parseUser.image} />

          {/* nom et prenom */}
          <EditProfileFirstAndLastNameSection
            firstAndLastName={parseUser.firstAndLastName}
          />

          {/* nom d'utilisateur */}
          <EditProfileUserNameSection userName={parseUser.userName} />

          {/* genre */}
          <EditProfileGenderSection gender={parseUser.gender} />

          {/* date de naissance */}
          <EditProfileDateOfBirthSection
            dateOfBirth={
              parseUser.dateOfBirth
                ? new Date(
                    parseUser.dateOfBirth._seconds * 1000 +
                      parseUser.dateOfBirth._nanoseconds / 1000000,
                  )
                : undefined
            }
          />

          {/* phonenumber */}
          {/* <View style={{ gap: 8 }}>
            <AppText font="Medium" fontSize={15}>
              Numéro de tеlеphone
            </AppText>

            <AppMobileNumberInput />

            {errors.phoneNumber && (
              <AppText style={{ color: "red" }}>
                {errors.phoneNumber.message}
              </AppText>
            )}
          </View> */}

          {/* whatsapp number */}
          {/* <View style={{ gap: 8 }}>
            <AppText font="Medium" fontSize={15}>
              Numéro Whatsapp
            </AppText>

            <AppMobileNumberInput />

            {errors.whatsappNumber && (
              <AppText style={{ color: "red" }}>
                {errors.whatsappNumber.message}
              </AppText>
            )}
          </View> */}

          {parseUser.authMethod === "EMAIL_PASSWORD" && (
            <>
              {/* email */}
              <EditProfilEmailSection email={parseUser.email} />

              {/* passWord */}
              <EditProfilePasswordSection />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {},
});
