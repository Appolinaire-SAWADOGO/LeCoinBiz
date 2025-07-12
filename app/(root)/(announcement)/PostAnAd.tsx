import Container from "@/components/Container";
import AppButton from "@/components/custom/AppButton";
import PageHeader from "@/components/PageHeader";
import PostAnAdSection from "@/components/PostAnAd/PostAnAdSection";
import PostAnAdCategorieSection from "@/components/PostAnAd/sections/PostAnAdCategorieSection";
import PostAnAdCitySection from "@/components/PostAnAd/sections/PostAnAdCitySection";
import PostAnAdConditionsSection from "@/components/PostAnAd/sections/PostAnAdConditionsSection";
import PostAnAdOptionsSection from "@/components/PostAnAd/sections/PostAnAdOptionsSection";
import PostAnAdPhotosSection from "@/components/PostAnAd/sections/PostAnAdPhotosSection";
import { useAdAddState } from "@/hooks/useAdAddState";
import React from "react";
import { ScrollView } from "react-native";

export default function PostAnAd() {
  const {
    title,
    setTitle,
    category,
    setCategory,
    price,
    setPrice,
    desc,
    setDesc,
    options,
    setOptions,
    city,
    setCity,
    number,
    setNumber,
  } = useAdAddState();

  return (
    <Container>
      <PageHeader name="Poster une annonce" style={{ paddingHorizontal: 20 }} />
      <ScrollView
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        contentContainerStyle={{ gap: 20, paddingBottom: 50 }}
      >
        <PostAnAdSection
          label="Titre"
          placeholder="Ecrivez le titre de l'annonce"
        />

        <PostAnAdCategorieSection />

        <PostAnAdSection
          label="Prix"
          placeholder="Ecrivez le prix de l'annonce"
        />

        <PostAnAdSection
          style={{ height: 120, textAlignVertical: "top" }}
          label="Description"
          placeholder="Ecrivez la description de l'annonce"
        />

        <PostAnAdPhotosSection />

        <PostAnAdOptionsSection options={options} setOptions={setOptions} />

        <PostAnAdConditionsSection />

        <PostAnAdCitySection />

        <PostAnAdSection label="Numero" placeholder="Ecrivez le numero" />

        <AppButton title="Publier" style={{ borderRadius: 8 }} />
      </ScrollView>
    </Container>
  );
}
