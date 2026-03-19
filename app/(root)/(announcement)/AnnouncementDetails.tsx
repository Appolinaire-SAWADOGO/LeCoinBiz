import AnnouncementDetailsFloatingButtons from "@/components/announcement-details/AnnouncementDetailsFloatingButtons";
import AnnouncementDetailsHeaderSection from "@/components/announcement-details/sections/AnnouncementDetailsHeaderSection";
import AnnouncementDetailsImagesSection from "@/components/announcement-details/sections/AnnouncementDetailsImagesSection";
import AnnouncementDetailsInfoSection from "@/components/announcement-details/sections/AnnouncementDetailsInfoSection";
import AnnouncementDetailsProfileSection from "@/components/announcement-details/sections/AnnouncementDetailsProfileSection";
import AnnouncementDetailsPublicationReportingSection from "@/components/announcement-details/sections/AnnouncementDetailsPublicationReportingSection";
import AnnouncementDetailsSimilarsAdSection from "@/components/announcement-details/sections/AnnouncementDetailsSimilarsAdSection";
import Container from "@/components/Container";
import AppFullScreenLoader from "@/components/custom/AppFullScreenLoader";
import { useGetAdById } from "@/hooks/services/ads/useGetAdById";
import { useIncrementAdClics } from "@/hooks/services/ads/useIncrementAdClics";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, AnnouncementType } from "@/types";
import { formatCreatedAt } from "@/utils";
import { getCurrentUserAuthMethod } from "@/utils/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnnouncementDetails() {
  const { designSystem } = useAppTheme();

  const { getAdById } = useGetAdById();

  const { initialRslt, from } = useLocalSearchParams();

  const initialAd: AnnouncementType = JSON.parse(initialRslt as string);

  // console.log(JSON.stringify(initialAd, null, 2));

  const currentUser = useCurrentUser();
  const currentUserAuthMethod = getCurrentUserAuthMethod(currentUser);

  const queryClient = useQueryClient();

  const { incrementAdClics } = useIncrementAdClics();

  const { data: ad, isLoading: adIsLoading } = useQuery({
    queryKey: ["ad", initialAd.id],
    queryFn: () => getAdById(initialAd.id as string),
    initialData: () => {
      return queryClient.getQueryData(["ad", initialAd.id]) ?? initialAd;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    (async () => {
      await incrementAdClics(
        ad?.id as string,
        ad?.userId as string,
        from as "OtherPage" | "ProfilePage",
      );
    })();
  }, []);

  const isLoading = adIsLoading;

  return (
    <Container withBottom withGoBack>
      {(isLoading || !ad) && <AppFullScreenLoader />}
      {!isLoading && ad && (
        <>
          {/* header */}
          <AnnouncementDetailsHeaderSection
            from={from as "OtherPage" | "ProfilePage"}
            status={ad.status as AdStatusType}
            name={
              ad?.title.length! > 15
                ? ad?.title.slice(0, 15) + "..."
                : ad?.title
            }
            adId={ad.id as string}
            ad={ad}
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
                images={ad?.images as string[]}
                video={ad?.video} // ← AJOUTE cette ligne
              />

              {/* Section principale */}
              <View style={styles.mainContent}>
                {/* Announcement Details Info Section */}
                <AnnouncementDetailsInfoSection
                  currentAnnouncement={ad as AnnouncementType}
                  from={from as "OtherPage" | "ProfilePage"}
                />

                {/*profile */}
                {from === "OtherPage" && (
                  <AnnouncementDetailsProfileSection userId={ad.userId} />
                )}

                {/* share */}
                {/* {ad.status === "ACTIVATED" && (
                  <AnnouncementDetailsShareSection from={from as string} />
                )} */}

                {/* report publication and similar ad */}
                {from === "OtherPage" && (
                  <>
                    <AnnouncementDetailsSimilarsAdSection ad={ad} />
                    {currentUser && ad.userId !== currentUser?.uid && (
                      <AnnouncementDetailsPublicationReportingSection
                        adId={ad.id}
                        adUserId={ad.userId}
                        emailVerified={currentUser.emailVerified}
                        currentUserAuthMethod={currentUserAuthMethod}
                      />
                    )}
                  </>
                )}
              </View>
            </ScrollView>

            {/* Boutons d'action flottants */}
            <AnnouncementDetailsFloatingButtons
              from={from as "OtherPage" | "ProfilePage"}
              status={ad.status as AdStatusType}
              whattsAppNumber={ad.whatsappNumber}
              phoneNumber={ad.phoneNumber}
              adImage={ad.images[0]}
              adTitle={ad.title}
              adPrice={ad.price.toString()}
              adCategory={ad.category}
              adSubCategory={ad.subCategory}
              adTempUb={formatCreatedAt(ad.createdAt)}
              adId={ad.id}
              ad={ad}
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
