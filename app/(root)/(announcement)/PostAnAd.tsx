import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppMobileNumberInput from "@/components/custom/input/AppMobileNumberInput";
import PageHeader from "@/components/PageHeader";
import PostAnAdSection from "@/components/post-an-ad/PostAnAdSection";
import PostAnAdCitySection from "@/components/post-an-ad/sections/PostAnAdCitySection";
import PostAnAdMapAddressSection from "@/components/post-an-ad/sections/PostAnAdMapAddressSection";
import PostAnAdOptionsSection from "@/components/post-an-ad/sections/PostAnAdOptionsSection";
import PostAnAdPhotosSection from "@/components/post-an-ad/sections/PostAnAdPhotosSection";
import { BURKINA_CITIES } from "@/constants/burkinaCities";
import { useEditAd } from "@/hooks/services/ads/useEditAds";
import { usePostAnAd } from "@/hooks/services/ads/usePostAnAd";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import { matchBurkinaCity } from "@/utils";
import { PostAnAddSchema } from "@/zod/schema/postAnAd.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

type FormData = z.infer<typeof PostAnAddSchema>;

const STEPS = [
  {
    key: "essentiel",
    label: "Infos",
    title: "Décrivez votre annonce",
    description:
      "Donnez un titre clair et un prix juste : c'est ce que les acheteurs voient en premier dans la liste des annonces.",
  },
  {
    key: "photos",
    label: "Photos",
    title: "Ajoutez des photos et une description",
    description:
      "Des photos nettes et une description détaillée rassurent l'acheteur et augmentent vos chances de vendre vite.",
  },
  {
    key: "localisation",
    label: "Localisation",
    title: "Où se trouve votre annonce ?",
    description:
      "Indiquez votre ville et, si vous le souhaitez, l'adresse exacte de votre boutique pour que les clients puissent vous localiser sur la carte.",
  },
  {
    key: "contact",
    label: "Contact",
    title: "Comment vous joindre ?",
    description:
      "Ces numéros seront visibles par les acheteurs intéressés pour vous appeler ou vous écrire sur WhatsApp.",
  },
] as const;

const StepHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View style={{ gap: 4 }}>
    <AppText style={styles.stepTitle}>{title}</AppText>
    <AppText style={styles.stepDescription}>{description}</AppText>
  </View>
);

type StepFieldMap = Record<number, (keyof FormData)[]>;

const STEP_FIELDS: StepFieldMap = {
  0: ["title", "price"],
  1: ["images", "description", "options"],
  2: ["city", "address"] as any,
  3: ["phoneNumber", "whatsappNumber"],
};

export default function PostAnAd() {
  const { designSystem } = useAppTheme();

  const { ad, from } = useLocalSearchParams();

  const parseAd: AnnouncementType | null = ad ? JSON.parse(ad as string) : null;

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const fieldPositions = useRef<{ [key: string]: number }>({});

  const handleLayout = (fieldName: string) => (event: LayoutChangeEvent) => {
    fieldPositions.current[fieldName] = event.nativeEvent.layout.y;
  };

  const [formKey, setFormKey] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === STEPS.length - 1;

  const {
    control,
    handleSubmit,
    trigger,
    reset: resetForm,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(PostAnAddSchema),
    mode: "onChange",
    defaultValues: {
      title: parseAd ? parseAd.title : "",
      price: parseAd ? parseAd.price : undefined,
      description: parseAd ? parseAd.description : "",
      images: parseAd ? parseAd.images : [],
      video: parseAd ? parseAd.video : undefined,
      options: parseAd
        ? parseAd.options
        : [
            { label: "Livraison Gratuite", active: false },
            { label: "Neuf", active: false },
          ],
      city: parseAd ? parseAd.city : "",
      address: parseAd ? (parseAd as any).address : undefined,
      phoneNumber: parseAd ? parseAd.phoneNumber : "",
      whatsappNumber: parseAd ? parseAd.whatsappNumber : "",
    },
  });

  const { postAnAdd } = usePostAnAd();
  const { editAd } = useEditAd();

  const insets = useSafeAreaInsets();

  // Scroll vers le premier champ en erreur de l'étape courante
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const currentFields = STEP_FIELDS[currentStep] || [];
      const firstErrorField = currentFields.find((f) => (errors as any)[f]);
      const yPosition = firstErrorField
        ? fieldPositions.current[firstErrorField as string]
        : undefined;

      if (yPosition !== undefined && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToPosition(0, yPosition - 100, true);
        }, 100);
      }
    }
  }, [errors, currentStep]);

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
        watch("video") !== parseAd.video ||
        JSON.stringify(watch("options")) !== JSON.stringify(parseAd.options) ||
        watch("city") !== parseAd.city ||
        JSON.stringify(watch("address")) !== JSON.stringify(parseAd.address) ||
        watch("phoneNumber") !== parseAd.phoneNumber ||
        watch("whatsappNumber") !== parseAd.whatsappNumber)
    );
  };

  const goNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep] || [];
    const valid = await trigger(fieldsToValidate as any);
    if (!valid) return;

    scrollViewRef.current?.scrollToPosition(0, 0, true);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    scrollViewRef.current?.scrollToPosition(0, 0, true);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const progressPercent = useMemo(
    () => ((currentStep + 1) / STEPS.length) * 100,
    [currentStep],
  );

  const onSubmit = handleSubmit(async (data) => {
    // Filtrer les images vides avant d'envoyer au réseau
    const cleanData = {
      ...data,
      images: data.images.filter((img) => img !== ""),
    };

    if (parseAd) {
      await editAd(
        cleanData,
        parseAd,
        parseAd.status,
        parseAd.id,
        from as "NORMAL" | "AD_DETAILS",
      );
    } else {
      await postAnAdd(cleanData, resetForm, () => {
        setFormKey((prev) => prev + 1);
        setCurrentStep(0);
      });
    }
  });

  return (
    <Container withBottom={false} withGoBack>
      <PageHeader
        name={parseAd ? "Modifier l'annonce" : "Poster une annonce"}
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.segmentContainer}>
          {STEPS.map((_, idx) => {
            const segmentRange = 100 / STEPS.length;
            const start = idx * segmentRange;
            const fillPercent = Math.max(
              0,
              Math.min(100, ((progressPercent - start) / segmentRange) * 100),
            );

            return (
              <View
                key={idx}
                style={[
                  styles.segmentTrack,
                  idx !== STEPS.length - 1 ? { marginRight: 8 } : {},
                ]}
              >
                <View
                  style={[
                    styles.segmentFill,
                    {
                      width: `${fillPercent}%`,
                      backgroundColor: designSystem.colors.primary,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.stepLabelRow}>
          <AppText style={styles.stepLabelText}>
            Étape {currentStep + 1}/{STEPS.length}
          </AppText>
        </View>
      </View>

      <KeyboardAwareScrollView
        key={formKey}
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 10,
          backgroundColor: "#fff",
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {currentStep === 0 && (
          <>
            <StepHeader
              title={STEPS[0].title}
              description={STEPS[0].description}
            />

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
          </>
        )}

        {currentStep === 1 && (
          <>
            <StepHeader
              title={STEPS[1].title}
              description={STEPS[1].description}
            />

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
                        errors={errors.images}
                      />
                    </View>
                  )}
                />
              )}
            />

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

            <Controller
              control={control}
              name="options"
              render={({ field: { onChange, value } }) => (
                <View onLayout={handleLayout("options")}>
                  <PostAnAdOptionsSection value={value} onChange={onChange} />
                </View>
              )}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <StepHeader
              title={STEPS[2].title}
              description={STEPS[2].description}
            />

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

            <Controller
              control={control}
              name={"address" as any}
              render={({ field: { onChange, value } }) => (
                <View onLayout={handleLayout("address")}>
                  <PostAnAdMapAddressSection
                    value={value}
                    onChange={onChange}
                    onCityDetected={(detectedCity) => {
                      const matched = matchBurkinaCity(
                        detectedCity,
                        BURKINA_CITIES,
                      );
                      if (matched) {
                        setValue("city", matched, { shouldValidate: true });
                      }
                    }}
                    optional
                    style={{
                      borderColor: (errors as any).address ? "red" : "#E5E5E5",
                    }}
                  />
                  {(errors as any).address && (
                    <AppText style={{ color: "red", marginTop: 10 }}>
                      {(errors as any).address.message}
                    </AppText>
                  )}
                </View>
              )}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <StepHeader
              title={STEPS[3].title}
              description={STEPS[3].description}
            />

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
          </>
        )}

        <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
          {currentStep > 0 && (
            <AppButton
              title="Retour"
              style={{
                borderRadius: 8,
                elevation: 0,
                flex: 1,
                backgroundColor: "#F2F2F2",
              }}
              textStyle={{ color: "#333" }}
              onPress={goBack}
            />
          )}

          {!isLastStep ? (
            <AppButton
              title="Suivant"
              style={{ borderRadius: 8, elevation: 0, flex: 1 }}
              onPress={goNext}
            />
          ) : (
            <AppButton
              title={parseAd ? "Modifier" : "Publier"}
              style={{ borderRadius: 8, elevation: 0, flex: 1 }}
              onPress={onSubmit}
              isLoading={isSubmitting}
              disabled={!isButtonActive() || isSubmitting}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  stepLabelRow: {
    marginTop: 6,
  },
  stepLabelText: {
    fontSize: 12,
    color: "#666",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  stepDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  segmentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },
  segmentFill: {
    height: "100%",
    borderRadius: 3,
  },
});
