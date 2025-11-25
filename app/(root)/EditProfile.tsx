import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import AppPasswordInput from "@/components/custom/input/AppPasswordInput";
import EditProfileDateOfBirth from "@/components/edit-profile/EditProfileDateOfBirth";
import EditProfileGenderSection from "@/components/edit-profile/EditProfileGenderSection";
import EditProfileImageSection from "@/components/edit-profile/EditProfileImageSection";
import EditProfileSection from "@/components/edit-profile/EditProfileSection";
import PageHeader from "@/components/PageHeader";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { EditProfileSchema } from "@/zod/schema/editProfile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import z from "zod";

type FormData = z.infer<typeof EditProfileSchema>;

export default function EditProfile() {
  const { designSystem } = useAppTheme();

  const { user } = useLocalSearchParams();

  const parseUser = JSON.parse(user as string) as UserType;

  const { editProfile } = useEditProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      image: parseUser.image || "",
      firstAndLastName: parseUser.firstAndLastName || "",
      userName: parseUser.userName || "",
      gender: parseUser.gender || "",
      dateOfBirth: parseUser.dateOfBirth
        ? parseUser.dateOfBirth.toDate()
        : undefined,
      phoneNumber: parseUser.phoneNumber?.replace(/^\+226/, "") || "",
      whatsappNumber: parseUser.whatsappNumber?.replace(/^\+226/, "") || "",
      email: parseUser.email || "",
      passWord: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!data) return;

    await editProfile(data);
  };

  const watchedDate = watch("dateOfBirth");
  const userDate = parseUser.dateOfBirth
    ? parseUser.dateOfBirth.toDate()
    : null;

  const isSameDate =
    (!watchedDate && !userDate) ||
    (watchedDate instanceof Date &&
      userDate instanceof Date &&
      watchedDate.getTime() === userDate.getTime());

  const isButtonActive =
    watch("image") !== parseUser.image ||
    watch("firstAndLastName") !== parseUser.firstAndLastName ||
    watch("userName") !== parseUser.userName ||
    watch("gender") !== parseUser.gender ||
    !isSameDate ||
    watch("phoneNumber") !== parseUser.phoneNumber?.replace(/^\+226/, "") ||
    watch("whatsappNumber") !==
      parseUser.whatsappNumber?.replace(/^\+226/, "") ||
    watch("email") !== parseUser.email;

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
            flexGrow: 1,
            gap: 15,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* image */}
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value } }) => (
              <EditProfileImageSection
                onChange={onChange}
                value={value as string}
                userImg={parseUser.image}
              />
            )}
          />

          {/* nom et prenom */}
          <Controller
            control={control}
            name="firstAndLastName"
            render={({ field: { onChange, value } }) => (
              <EditProfileSection
                label="Nom & Prenom"
                placeHolder="John Doe"
                onChange={onChange}
                value={value as string}
              />
            )}
          />

          {/* nom d'utilisateur */}
          <Controller
            control={control}
            name="userName"
            render={({ field: { onChange, value } }) => (
              <EditProfileSection
                label="Nom d'utilisateur"
                placeHolder="john.doe"
                onChange={onChange}
                value={value as string}
              />
            )}
          />

          {/* genre */}
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <EditProfileGenderSection
                value={value as string}
                onChange={onChange}
              />
            )}
          />

          {/* date de naissance */}
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <EditProfileDateOfBirth
                onChange={onChange}
                value={value as Date}
              />
            )}
          />

          {/* phonenumber */}
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <View style={{ gap: 8 }}>
                <AppText font="Medium" fontSize={15}>
                  Numéro de tеlеphone
                </AppText>

                <AppMobileNumberInput
                  phoneNumber={value as string}
                  onChange={onChange}
                />

                {errors.phoneNumber && (
                  <AppText style={{ color: "red" }}>
                    {errors.phoneNumber.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/* whatsapp number */}
          <Controller
            control={control}
            name="whatsappNumber"
            render={({ field: { onChange, value } }) => (
              <View style={{ gap: 8 }}>
                <AppText font="Medium" fontSize={15}>
                  Numéro Whatsapp
                </AppText>

                <AppMobileNumberInput
                  phoneNumber={value as string}
                  onChange={onChange}
                />

                {errors.whatsappNumber && (
                  <AppText style={{ color: "red" }}>
                    {errors.whatsappNumber.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/* email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <EditProfileSection
                label="Email"
                placeHolder="john.doe@me.com"
                keyboardType="email-address"
                onChange={onChange}
                value={value as string}
              >
                {errors.email && (
                  <AppText style={{ color: "red" }}>
                    {errors.email.message}
                  </AppText>
                )}

                <TouchableOpacity>
                  <AppText color={designSystem.colors.primary}>
                    Vérifier l&lsquo;adresse l&lsquo;e-mail
                  </AppText>
                </TouchableOpacity>
              </EditProfileSection>
            )}
          />

          {/* passWord */}
          <Controller
            control={control}
            name="passWord"
            render={({ field: { onChange, value } }) => (
              <View style={{ gap: 8 }}>
                <AppText font="Medium" fontSize={15}>
                  Mot de passe
                </AppText>

                <AppPasswordInput
                  value={value as string}
                  onChangeText={onChange}
                />
              </View>
            )}
          />

          <AppButton
            title="Enregistrer"
            onPress={handleSubmit(onSubmit)}
            style={{ borderRadius: 8 }}
            disabled={isSubmitting || !isButtonActive}
            isLoading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {},
});
