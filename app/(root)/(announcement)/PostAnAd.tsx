import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import PageHeader from "@/components/PageHeader";
import PostAnAdSection from "@/components/post-an-ad/PostAnAdSection";
import PostAnAdCategorieSection from "@/components/post-an-ad/sections/PostAnAdCategorieSection";
import PostAnAdCitySection from "@/components/post-an-ad/sections/PostAnAdCitySection";
import PostAnAdConditionsSection from "@/components/post-an-ad/sections/PostAnAdConditionsSection";
import PostAnAdOptionsSection from "@/components/post-an-ad/sections/PostAnAdOptionsSection";
import PostAnAdPhotosSection from "@/components/post-an-ad/sections/PostAnAdPhotosSection";
import PostAnAdSubCategorySection from "@/components/post-an-ad/sections/PostAnAdSubCategorySection";
import { usePostAnAd } from "@/hooks/services/ads/usePostAnAd";
import { AnnouncementType } from "@/types";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

type FormData = z.infer<typeof PostAnAddSchema>;

export default function PostAnAd() {
  const { ad } = useLocalSearchParams<{ ad?: string }>();

  const parseAd: AnnouncementType | null = ad ? JSON.parse(ad) : null;

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(PostAnAddSchema),
    defaultValues: {
      title: parseAd ? parseAd.title : "",
      price: parseAd ? parseAd.price : undefined,
      category: parseAd ? parseAd.category : "",
      subCategory: parseAd ? parseAd.subCategory : "",
      description: parseAd ? parseAd.description : "",
      conditions: parseAd ? parseAd.conditions : [],
      images: parseAd ? parseAd.images : [],
      options: parseAd
        ? parseAd.options
        : [
            { label: "Livraison Gratuite", active: false },
            { label: "Neuf", active: false },
          ],
      city: parseAd ? parseAd.city : "",
      phoneNumber: parseAd ? parseAd.phoneNumber : "",
      whatsappNumber: parseAd ? parseAd.whatsappNumber : "",
    },
  });

  const { postAnAdd } = usePostAnAd();

  const insets = useSafeAreaInsets();

  const category = watch("category");

  const isButtonActive = () => {
    const ifAllExist =
      !!watch("title") &&
      !!watch("price") &&
      !!watch("category") &&
      !!watch("subCategory") &&
      !!watch("description") &&
      !!watch("conditions") &&
      !!watch("images") &&
      !!watch("options") &&
      !!watch("city") &&
      !!watch("phoneNumber") &&
      !!watch("whatsappNumber");

    if (!parseAd) return ifAllExist;

    return (
      ifAllExist &&
      (watch("title") !== parseAd.title ||
        watch("price") !== parseAd.price ||
        JSON.stringify(watch("conditions")) !==
          JSON.stringify(parseAd.conditions) ||
        JSON.stringify(watch("category")) !==
          JSON.stringify(parseAd.category) ||
        JSON.stringify(watch("subCategory")) !==
          JSON.stringify(parseAd.subCategory) ||
        watch("description") !== parseAd.description ||
        JSON.stringify(watch("conditions")) !==
          JSON.stringify(parseAd.conditions) ||
        JSON.stringify(watch("images")) !== JSON.stringify(parseAd.images) ||
        JSON.stringify(watch("options")) !== JSON.stringify(parseAd.options) ||
        watch("city") !== parseAd.city ||
        watch("phoneNumber") !== parseAd.phoneNumber ||
        watch("whatsappNumber") !== parseAd.whatsappNumber)
    );
  };

  return (
    <Container withBottom={false} withGoBack>
      {/* page header */}
      <PageHeader
        name={parseAd ? "Modifier l'annonce" : "Poster une annonce"}
        style={{ paddingHorizontal: 20 }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* scroll view */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 10,
            backgroundColor: "#fff",
            gap: 15,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/*titre*/}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdSection
                  onChangeText={onChange}
                  value={value}
                  label="Titre"
                  placeholder="Ecrivez le titre de l'annonce"
                  maxLength={100}
                  style={{
                    borderColor: errors.title ? "red" : "#E5E5E5",

                    padding: 10,
                  }}
                />
                {errors.title && (
                  <AppText style={{ color: "red", marginTop: 8 }}>
                    {errors.title.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*category*/}
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdCategorieSection
                  value={value}
                  onChangeText={onChange}
                  style={{
                    borderColor: errors.category ? "red" : "#E5E5E5",
                    padding: 10,
                  }}
                />
                {errors.category && (
                  <AppText style={{ color: "red", marginTop: 8 }}>
                    {errors.category.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/* sub category*/}
          {category && (
            <Controller
              control={control}
              name="subCategory"
              render={({ field: { onChange, value } }) => (
                <View>
                  <PostAnAdSubCategorySection
                    subCategory={value}
                    setSubCategory={onChange}
                    category={category}
                    style={{
                      borderColor: errors.subCategory ? "red" : "#E5E5E5",

                      padding: 10,
                    }}
                  />
                  {errors.subCategory && (
                    <AppText style={{ color: "red", marginTop: 8 }}>
                      {errors.subCategory.message}
                    </AppText>
                  )}
                </View>
              )}
            />
          )}

          {/*price*/}
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdSection
                  keyboardType={"numeric"}
                  label="Prix"
                  maxLength={8}
                  placeholder="Ecrivez le prix de l'annonce"
                  onChangeText={onChange}
                  value={value?.toString()}
                  style={{
                    borderColor: errors.price ? "red" : "#E5E5E5",

                    padding: 10,
                  }}
                />
                {errors.price && (
                  <AppText style={{ color: "red", marginTop: 8 }}>
                    {errors.price.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*description*/}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <>
                <PostAnAdSection
                  label="Description"
                  maxLength={1000}
                  placeholder="Ecrivez la description de l'annonce"
                  onChangeText={onChange}
                  value={value?.toString()}
                  style={{
                    borderColor: errors.description ? "red" : "#E5E5E5",

                    padding: 10,
                  }}
                />
                {errors.description && (
                  <AppText style={{ color: "red", marginTop: 8 }}>
                    {errors.description.message}
                  </AppText>
                )}
              </>
            )}
          />

          {/*images*/}
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdPhotosSection
                  value={value}
                  onChange={onChange}
                  style={{
                    borderColor: errors.images ? "red" : "#E5E5E5",
                  }}
                />
                {errors.images && (
                  <AppText style={{ color: "red", marginTop: 10 }}>
                    {errors.images.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*options*/}
          <Controller
            control={control}
            name="options"
            render={({ field: { onChange, value } }) => (
              <PostAnAdOptionsSection value={value} onChange={onChange} />
            )}
          />

          {/*conditions*/}
          <Controller
            control={control}
            name="conditions"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdConditionsSection
                  value={value}
                  onChange={onChange}
                  style={{
                    borderColor: errors.conditions ? "red" : "#E5E5E5",
                  }}
                />
                {errors.conditions && (
                  <AppText style={{ color: "red", marginTop: 10 }}>
                    {errors.conditions.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*city*/}
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdCitySection
                  value={value}
                  onChange={onChange}
                  style={{
                    borderColor: errors.city ? "red" : "#E5E5E5",
                  }}
                />
                {errors.city && (
                  <AppText style={{ color: "red", marginTop: 10 }}>
                    {errors.city.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*phoneNumber*/}
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdSection label="Numero de telephone">
                  <AppMobileNumberInput
                    phoneNumber={value}
                    onChange={onChange}
                    style={{
                      borderColor: errors.phoneNumber ? "red" : "#E5E5E5",
                    }}
                    leftStyle={{
                      borderColor: errors.phoneNumber ? "red" : "#E5E5E5",
                    }}
                  />
                </PostAnAdSection>
                {errors.phoneNumber && (
                  <AppText style={{ color: "red", marginTop: 10 }}>
                    {errors.phoneNumber.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/*whatsappNumber*/}
          <Controller
            control={control}
            name="whatsappNumber"
            render={({ field: { onChange, value } }) => (
              <View>
                <PostAnAdSection label="Numero whatsapp">
                  <AppMobileNumberInput
                    phoneNumber={value}
                    onChange={onChange}
                    style={{
                      borderColor: errors.whatsappNumber ? "red" : "#E5E5E5",
                    }}
                    leftStyle={{
                      borderColor: errors.whatsappNumber ? "red" : "#E5E5E5",
                    }}
                  />
                </PostAnAdSection>
                {errors.whatsappNumber && (
                  <AppText style={{ color: "red", marginTop: 10 }}>
                    {errors.whatsappNumber.message}
                  </AppText>
                )}
              </View>
            )}
          />

          {/* submit button  */}
          <AppButton
            title={parseAd ? "Modifier" : "Publier"}
            style={{ borderRadius: 8, elevation: 0 }}
            onPress={handleSubmit(async (data) => {
              await postAnAdd(data, resetForm);
            })}
            isLoading={isSubmitting}
            disabled={!isButtonActive() || isSubmitting}
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
