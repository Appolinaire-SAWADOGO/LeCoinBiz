import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import AppCenterModal from "@/components/modals/AppCenterModal";
import PageHeader from "@/components/PageHeader";
import PostAnAdSection from "@/components/post-an-ad/PostAnAdSection";
import PostAnAdCategorieSection from "@/components/post-an-ad/sections/PostAnAdCategorieSection";
import PostAnAdCitySection from "@/components/post-an-ad/sections/PostAnAdCitySection";
import PostAnAdConditionsSection from "@/components/post-an-ad/sections/PostAnAdConditionsSection";
import PostAnAdOptionsSection from "@/components/post-an-ad/sections/PostAnAdOptionsSection";
import PostAnAdPhotosSection from "@/components/post-an-ad/sections/PostAnAdPhotosSection";
import { usePostAnAdd } from "@/hooks/services/post-an-ad/usePostAnAdd";
import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import { postAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";

type FormData = z.infer<typeof postAnAddSchema>;

export default function PostAnAd() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [whatsappNumber, setWhatsappNumber] = React.useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(postAnAddSchema),
    defaultValues: {
      options: [
        { label: "Livraison gratuite", active: false },
        { label: "Neuf", active: false },
      ],
    },
  });

  const { postAnAdd } = usePostAnAdd();

  const { close, isOpen, alertMsg } = usePickerImageAlertModalStore();

  return (
    <Container>
      {/* Alert modal  */}
      <AppCenterModal
        isOpen={isOpen}
        setIsOpen={close}
        title="Alerte"
        submitText="Ok"
        footerStyle={{ justifyContent: "center" }}
        onSubmit={close}
        withCancelButton={false}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <AppText
            style={{
              fontSize: 16,
              lineHeight: 22,
              color: "#333",
            }}
          >
            {alertMsg}
          </AppText>
        </View>
      </AppCenterModal>

      {/* page header */}
      <PageHeader name="Poster une annonce" style={{ paddingHorizontal: 20 }} />

      {/* main */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* scroll view */}
        <ScrollView
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
          contentContainerStyle={{ gap: 20, paddingBottom: 50 }}
        >
          {/*titre*/}
          <View>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <PostAnAdSection
                  onChangeText={onChange}
                  value={value}
                  label="Titre"
                  placeholder="Ecrivez le titre de l'annonce"
                  maxLength={100}
                  style={{
                    borderColor: errors.title ? "red" : "#E5E5E5",
                    marginBottom: 8,
                    padding: 10,
                  }}
                />
              )}
            />
            {errors.title && (
              <AppText style={{ color: "red" }}>{errors.title.message}</AppText>
            )}
          </View>

          {/*category*/}
          <View>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange } }) => (
                <PostAnAdCategorieSection
                  onChangeText={onChange}
                  style={{
                    borderColor: errors.category ? "red" : "#E5E5E5",
                    marginBottom: 8,
                    padding: 10,
                  }}
                />
              )}
            />
            {errors.category && (
              <AppText style={{ color: "red" }}>
                {errors.category.message}
              </AppText>
            )}
          </View>

          {/*price*/}
          <View>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <PostAnAdSection
                  keyboardType={"numeric"}
                  label="Prix"
                  maxLength={8}
                  placeholder="Ecrivez le prix de l'annonce"
                  onChangeText={onChange}
                  value={value?.toString()}
                  style={{
                    borderColor: errors.price ? "red" : "#E5E5E5",
                    marginBottom: 8,
                    padding: 10,
                  }}
                />
              )}
            />
            {errors.price && (
              <AppText style={{ color: "red" }}>{errors.price.message}</AppText>
            )}
          </View>

          {/*description*/}
          <View>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <PostAnAdSection
                  label="Description"
                  maxLength={1000}
                  placeholder="Ecrivez la description de l'annonce"
                  onChangeText={onChange}
                  value={value?.toString()}
                  style={{
                    borderColor: errors.description ? "red" : "#E5E5E5",
                    marginBottom: 8,
                    padding: 10,
                  }}
                />
              )}
            />
            {errors.description && (
              <AppText style={{ color: "red" }}>
                {errors.description.message}
              </AppText>
            )}
          </View>

          {/*images*/}
          <View>
            <Controller
              control={control}
              name="images"
              render={({ field: { onChange, value } }) => (
                <PostAnAdPhotosSection
                  onChange={onChange}
                  style={{
                    borderColor: errors.images ? "red" : "#E5E5E5",
                  }}
                />
              )}
            />
            {errors.images && (
              <AppText style={{ color: "red", marginTop: 10 }}>
                {errors.images.message}
              </AppText>
            )}
          </View>

          {/*options*/}
          <View>
            <Controller
              control={control}
              name="options"
              render={({ field: { onChange, value } }) => (
                <PostAnAdOptionsSection onChange={onChange} />
              )}
            />
          </View>

          {/*conditions*/}
          <View>
            <Controller
              control={control}
              name="conditions"
              render={({ field: { onChange } }) => (
                <PostAnAdConditionsSection
                  onChange={onChange}
                  style={{
                    borderColor: errors.conditions ? "red" : "#E5E5E5",
                  }}
                />
              )}
            />
            {errors.conditions && (
              <AppText style={{ color: "red", marginTop: 10 }}>
                {errors.conditions.message}
              </AppText>
            )}
          </View>

          {/*city*/}
          <View>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange } }) => (
                <PostAnAdCitySection
                  onChange={onChange}
                  style={{
                    borderColor: errors.city ? "red" : "#E5E5E5",
                  }}
                />
              )}
            />
            {errors.city && (
              <AppText style={{ color: "red", marginTop: 10 }}>
                {errors.city.message}
              </AppText>
            )}
          </View>

          {/*phoneNumber*/}
          <View>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <PostAnAdSection label="Numero de telephone">
                  <AppMobileNumberInput
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    onChange={onChange}
                    style={{
                      borderColor: errors.phoneNumber ? "red" : "#E5E5E5",
                    }}
                    leftStyle={{
                      borderColor: errors.phoneNumber ? "red" : "#E5E5E5",
                    }}
                  />
                </PostAnAdSection>
              )}
            />
            {errors.phoneNumber && (
              <AppText style={{ color: "red", marginTop: 10 }}>
                {errors.phoneNumber.message}
              </AppText>
            )}
          </View>

          {/*whatsappNumber*/}
          <View>
            <Controller
              control={control}
              name="whatsappNumber"
              render={({ field: { onChange } }) => (
                <PostAnAdSection label="Numero whatsapp">
                  <AppMobileNumberInput
                    phoneNumber={whatsappNumber}
                    setPhoneNumber={setWhatsappNumber}
                    onChange={onChange}
                    style={{
                      borderColor: errors.whatsappNumber ? "red" : "#E5E5E5",
                    }}
                    leftStyle={{
                      borderColor: errors.whatsappNumber ? "red" : "#E5E5E5",
                    }}
                  />
                </PostAnAdSection>
              )}
            />
            {errors.whatsappNumber && (
              <AppText style={{ color: "red", marginTop: 10 }}>
                {errors.whatsappNumber.message}
              </AppText>
            )}
          </View>

          {/* submit button  */}
          <AppButton
            title="Publier"
            style={{ borderRadius: 8 }}
            onPress={handleSubmit(async (data) => {
              await postAnAdd(data);
            })}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
