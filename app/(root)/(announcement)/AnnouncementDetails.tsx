import AnnouncementDetailsFloatingButtons from "@/components/announcement-details/AnnouncementDetailsFloatingButtons";
import AnnouncementDetailsHeaderSection from "@/components/announcement-details/sections/AnnouncementDetailsHeaderSection";
import AnnouncementDetailsImagesSection from "@/components/announcement-details/sections/AnnouncementDetailsImagesSection";
import AnnouncementDetailsInfoSection from "@/components/announcement-details/sections/AnnouncementDetailsInfoSection";
import AnnouncementDetailsProfileSection from "@/components/announcement-details/sections/AnnouncementDetailsProfileSection";
import AnnouncementDetailsPublicationReportingSection from "@/components/announcement-details/sections/AnnouncementDetailsPublicationReportingSection";
import AnnouncementDetailsSimilarsAdSection from "@/components/announcement-details/sections/AnnouncementDetailsSimilarsAdSection";
import Container from "@/components/Container";
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
  const currentUser = useCurrentUser();
  const currentUserAuthMethod = getCurrentUserAuthMethod(currentUser);
  const queryClient = useQueryClient();
  const { incrementAdClics } = useIncrementAdClics();

  // Parse
  const initialAd: AnnouncementType | null = React.useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(initialRslt as string));
    } catch {
      return null;
    }
  }, [initialRslt]);

  const { data: ad } = useQuery({
    queryKey: ["ad", initialAd?.id],
    queryFn: async () => {
      try {
        return await getAdById(initialAd!.id);
      } catch {
        return initialAd as AnnouncementType; // ← fallback hors ligne
      }
    },
    enabled: !!initialAd,
    initialData: () =>
      queryClient.getQueryData(["ad", initialAd?.id]) ?? initialAd ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    networkMode: "offlineFirst",
  });

  const currentAd = ad ?? initialAd;
  if (!currentAd) return null;

  useEffect(() => {
    if (!currentAd) return;
    (async () => {
      try {
        await incrementAdClics(
          currentAd.id,
          currentAd.userId,
          from as "OtherPage" | "ProfilePage",
        );
      } catch {
        // Silencieux hors ligne
      }
    })();
  }, []);

  // Guard APRÈS tous les hooks
  if (!initialAd || !ad) return null;

  return (
    <Container withBottom withGoBack>
      {/* {(isLoading || !ad) && <AppFullScreenLoader />}
      {!isLoading && ad && (
        <> */}
      {/* header */}
      <AnnouncementDetailsHeaderSection
        from={from as "OtherPage" | "ProfilePage"}
        status={currentAd?.status as AdStatusType}
        name={
          currentAd?.title.length! > 15
            ? currentAd?.title.slice(0, 15) + "..."
            : currentAd?.title
        }
        adId={currentAd?.id as string}
        ad={currentAd as AnnouncementType}
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
            images={currentAd?.images ?? []}
            video={currentAd?.video} // ← AJOUTE cette ligne
          />

          {/* Section principale */}
          <View style={styles.mainContent}>
            {/* Announcement Details Info Section */}
            {currentAd && (
              <AnnouncementDetailsInfoSection
                currentAnnouncement={currentAd}
                from={from as "OtherPage" | "ProfilePage"}
              />
            )}

            {/*profile */}
            {from === "OtherPage" && (
              <AnnouncementDetailsProfileSection
                userId={currentAd?.userId as string}
              />
            )}

            {/* share */}
            {/* {currentAd.status === "ACTIVATED" && (
                  <AnnouncementDetailsShareSection from={from as string} />
                )} */}

            {/* report publication and similar ad */}
            {from === "OtherPage" && (
              <>
                <AnnouncementDetailsSimilarsAdSection
                  ad={currentAd as AnnouncementType}
                />
                {currentUser && currentAd?.userId !== currentUser?.uid && (
                  <AnnouncementDetailsPublicationReportingSection
                    adId={currentAd?.id as string}
                    adUserId={currentAd?.userId as string}
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
          status={currentAd?.status as AdStatusType}
          whattsAppNumber={currentAd?.whatsappNumber}
          phoneNumber={currentAd?.phoneNumber}
          adImage={currentAd?.images?.[0] ?? ""}
          adTitle={currentAd?.title as string}
          adPrice={currentAd?.price.toString() as string}
          adCategory={currentAd?.category as string}
          adSubCategory={currentAd?.subCategory as string}
          adTempUb={formatCreatedAt(
            currentAd?.createdAt as { _seconds: number; _nanoseconds: number },
          )}
          adId={currentAd?.id as string}
          ad={currentAd as AnnouncementType}
        />
      </View>
      {/* </>
      )} */}
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
