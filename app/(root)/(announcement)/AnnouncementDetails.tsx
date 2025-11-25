import AnnouncementDetailsFloatingButtons from "@/components/announcement-details/AnnouncementDetailsFloatingButtons";
import AnnouncementDetailsHeaderSection from "@/components/announcement-details/sections/AnnouncementDetailsHeaderSection";
import AnnouncementDetailsImagesSection from "@/components/announcement-details/sections/AnnouncementDetailsImagesSection";
import AnnouncementDetailsInfoSection from "@/components/announcement-details/sections/AnnouncementDetailsInfoSection";
import AnnouncementDetailsProfileSection from "@/components/announcement-details/sections/AnnouncementDetailsProfileSection";
import AnnouncementDetailsPublicationReportingSection from "@/components/announcement-details/sections/AnnouncementDetailsPublicationReportingSection";
import AnnouncementDetailsShareSection from "@/components/announcement-details/sections/AnnouncementDetailsShareSection";
import AnnouncementDetailsSimilarsAdSection from "@/components/announcement-details/sections/AnnouncementDetailsSimilarsAdSection";
import Container from "@/components/Container";
import AppFullScreenLoader from "@/components/custom/AppFullScreenLoader";
import { formatCreatedAt } from "@/functions";
import { useGetAdById } from "@/hooks/services/ads/useGetAdById";
import { useGetSimilarAds } from "@/hooks/services/ads/useGetSimilarsAds";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, AnnouncementType, UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnnouncementDetails() {
  const { designSystem } = useAppTheme();

  const { getAdById } = useGetAdById();
  const { getSimilarAds } = useGetSimilarAds();

  const { id, from, status } = useLocalSearchParams();

  const { data: adDetailsData, isLoading: adDetailsIsLoading } = useQuery({
    queryKey: ["ad-details", id],
    queryFn: () => getAdById(id as string),
  });

  const { data: similarsAdsData, isLoading: similarsAdsIsLoading } = useQuery({
    queryKey: ["similars-ads", id],
    queryFn: () =>
      getSimilarAds({
        currentAdId: id as string,
        title: adDetailsData?.ad?.title as string,
        category: adDetailsData?.ad?.category as string,
        subCategory: adDetailsData?.ad?.subCategory as string,
        conditions: adDetailsData?.ad?.conditions as string[],
        description: adDetailsData?.ad?.description as string,
        userId: adDetailsData?.user?.id as string,
        maxResults: 5,
      }),
    enabled: !!adDetailsData?.ad,
  });

  const isLoading = adDetailsIsLoading || similarsAdsIsLoading;

  return (
    <Container withBottom withGoBack>
      {(isLoading ||
        !adDetailsData?.ad ||
        !adDetailsData.user ||
        !similarsAdsData) && <AppFullScreenLoader />}
      {!isLoading &&
        adDetailsData?.ad &&
        adDetailsData.user &&
        similarsAdsData && (
          <>
            {/* header */}
            <AnnouncementDetailsHeaderSection
              from={from as "OtherPage" | "ProfilePage"}
              status={status as AdStatusType}
              name={
                adDetailsData.ad?.title.length! > 15
                  ? adDetailsData?.ad?.title.slice(0, 15) + "..."
                  : adDetailsData.ad?.title
              }
              adId={id as string}
            />

            {/* main */}
            <View style={[styles.main]}>
              {/* scroll view*/}
              <ScrollView
                scrollEventThrottle={16}
                contentContainerStyle={styles.contentContainer}
              >
                {/* Galerie d'images */}
                <AnnouncementDetailsImagesSection
                  images={adDetailsData?.ad?.images as string[]}
                />

                {/* Section principale */}
                <View style={styles.mainContent}>
                  {/* Announcement Details Info Section */}
                  <AnnouncementDetailsInfoSection
                    currentAnnouncement={adDetailsData?.ad as AnnouncementType}
                    from={from as "OtherPage" | "ProfilePage"}
                  />

                  {/*profile */}
                  {from === "OtherPage" && (
                    <AnnouncementDetailsProfileSection
                      userData={
                        adDetailsData?.user as UserType & { adsCount: number }
                      }
                    />
                  )}

                  {/* share */}
                  {status === "ACTIVATED" && (
                    <AnnouncementDetailsShareSection from={from as string} />
                  )}

                  {/* report publication and similar ad */}
                  {from === "OtherPage" && (
                    <>
                      <AnnouncementDetailsSimilarsAdSection
                        data={similarsAdsData!}
                      />
                      <AnnouncementDetailsPublicationReportingSection />
                    </>
                  )}
                </View>
              </ScrollView>

              {/* Boutons d'action flottants */}
              <AnnouncementDetailsFloatingButtons
                from={from as "OtherPage" | "ProfilePage"}
                status={status as AdStatusType}
                whattsAppNumber={adDetailsData.ad.whatsappNumber}
                phoneNumber={adDetailsData.ad.phoneNumber}
                adImage={adDetailsData.ad.images[0]}
                adTitle={adDetailsData.ad.title}
                adPrice={adDetailsData.ad.price.toString()}
                adCategory={adDetailsData.ad.category}
                adSubCategory={adDetailsData.ad.subCategory}
                adTempUb={formatCreatedAt(adDetailsData.ad.createdAt)}
                adId={adDetailsData.ad.id}
                ad={adDetailsData.ad}
              />
            </View>
          </>
        )}
    </Container>
  );
}

const styles = StyleSheet.create({
  main: {},

  contentContainer: {
    paddingBottom: 150,
    backgroundColor: "#fff",
  },

  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
