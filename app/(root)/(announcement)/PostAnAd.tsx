import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import PageHeader from "@/components/PageHeader";
import PostAnAdSection from "@/components/post-an-ad/PostAnAdSection";
import PostAnAdCitySection from "@/components/post-an-ad/sections/PostAnAdCitySection";
import PostAnAdOptionsSection from "@/components/post-an-ad/sections/PostAnAdOptionsSection";
import PostAnAdPhotosSection from "@/components/post-an-ad/sections/PostAnAdPhotosSection";
import { useEditAd } from "@/hooks/services/ads/useEditAds";
import { usePostAnAd } from "@/hooks/services/ads/usePostAnAd";
import { AnnouncementType } from "@/types";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LayoutChangeEvent, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

type FormData = z.infer<typeof PostAnAddSchema>;

export default function PostAnAd() {
  const { ad, from } = useLocalSearchParams();

  const parseAd: AnnouncementType | null = ad ? JSON.parse(ad as string) : null;

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const fieldPositions = useRef<{ [key: string]: number }>({});

  const fieldRefs = useRef<{ [key: string]: View | null }>({
    title: null,
    category: null,
    subCategory: null,
    price: null,
    description: null,
    images: null,
    options: null,
    city: null,
    phoneNumber: null,
    whatsappNumber: null,
  });

  const handleLayout =
    (fieldName: keyof typeof fieldPositions.current) =>
    (event: LayoutChangeEvent) => {
      fieldPositions.current[fieldName] = event.nativeEvent.layout.y;
    };

  const [formKey, setFormKey] = useState(0);

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
      description: parseAd ? parseAd.description : "",
      images: parseAd ? parseAd.images : [],
      video: parseAd ? parseAd.video : undefined, // ← NOUVEAU
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
  const { editAd } = useEditAd();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(
        errors,
      )[0] as keyof typeof fieldPositions.current;
      const yPosition = fieldPositions.current[firstErrorField];

      if (yPosition !== undefined && scrollViewRef.current) {
        // Utilisez scrollToPosition au lieu de measureLayout
        setTimeout(() => {
          scrollViewRef.current?.scrollToPosition(0, yPosition - 100, true);
        }, 100);
      }
    }
  }, [errors]);

  const isButtonActive = () => {
    const ifAllExist =
      !!watch("title") &&
      !!watch("price") &&
      !!watch("city") &&
      !!watch("phoneNumber") &&
      !!watch("whatsappNumber") &&
      watch("images")?.length > 0;

    if (!parseAd) return ifAllExist;

    return (
      ifAllExist &&
      (watch("title") !== parseAd.title ||
        watch("price") !== parseAd.price ||
        watch("description") !== parseAd.description ||
        JSON.stringify(watch("images")) !== JSON.stringify(parseAd.images) ||
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

      <KeyboardAwareScrollView
        key={formKey}
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 10,
          backgroundColor: "#fff",
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/*titre*/}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <View onLayout={handleLayout("title")}>
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

        {/*price*/}
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <View onLayout={handleLayout("price")}>
              <PostAnAdSection
                keyboardType={"numeric"}
                label="Prix"
                maxLength={9}
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
            <View onLayout={handleLayout("description")}>
              <PostAnAdSection
                label="Description"
                maxLength={1000}
                placeholder="Ecrivez la description de l'annonce"
                onChangeText={onChange}
                value={value?.toString()}
                optional
                style={{
                  borderColor: errors.description ? "red" : "#E5E5E5",
                  padding: 10,
                  height: 150,
                  textAlignVertical: "top",
                }}
                viewLenght={150}
                multiline={true}
              />
              {errors.description && (
                <AppText style={{ color: "red", marginTop: 8 }}>
                  {errors.description.message}
                </AppText>
              )}
            </View>
          )}
        />

        {/* images + vidéo */}
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => (
            <Controller
              control={control}
              name="video"
              render={({
                field: { onChange: onVideoChange, value: videoValue },
              }) => (
                <View onLayout={handleLayout("images")}>
                  <PostAnAdPhotosSection
                    value={value}
                    onChange={onChange}
                    video={videoValue}
                    onVideoChange={onVideoChange}
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
          )}
        />

        {/*options*/}
        <Controller
          control={control}
          name="options"
          render={({ field: { onChange, value } }) => (
            <View onLayout={handleLayout("options")}>
              <PostAnAdOptionsSection value={value} onChange={onChange} />
            </View>
          )}
        />

        {/*city*/}
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <View onLayout={handleLayout("city")}>
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
            <View onLayout={handleLayout("phoneNumber")}>
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
            <View onLayout={handleLayout("whatsappNumber")}>
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
          style={{ borderRadius: 8, elevation: 0, marginTop: 20 }}
          onPress={handleSubmit(async (data) => {
            if (parseAd) {
              await editAd(
                data,
                parseAd,
                parseAd.status,
                parseAd.id,
                from as "NORMAL" | "AD_DETAILS",
              );
            } else {
              await postAnAdd(data, resetForm, () => {
                setFormKey((prev) => prev + 1);
              });
            }
          })}
          isLoading={isSubmitting}
          disabled={!isButtonActive() || isSubmitting}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
}
