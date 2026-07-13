import AnnouncementDetailsFloatingButtons from "@/components/announcement-details/AnnouncementDetailsFloatingButtons";
import AnnouncementDetailsAddressSection from "@/components/announcement-details/sections/AnnouncementDetailsAddressSection";
import AnnouncementDetailsHeaderSection from "@/components/announcement-details/sections/AnnouncementDetailsHeaderSection";
import AnnouncementDetailsImagesSection from "@/components/announcement-details/sections/AnnouncementDetailsImagesSection";
import AnnouncementDetailsInfoSection from "@/components/announcement-details/sections/AnnouncementDetailsInfoSection";
import AnnouncementDetailsProfileSection from "@/components/announcement-details/sections/AnnouncementDetailsProfileSection";
import AnnouncementDetailsPublicationReportingSection from "@/components/announcement-details/sections/AnnouncementDetailsPublicationReportingSection";
import AnnouncementDetailsShareSection from "@/components/announcement-details/sections/AnnouncementDetailsShareSection";
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
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function AnnouncementDetails() {
  const { designSystem } = useAppTheme();
  const { getAdById } = useGetAdById();
  const { initialRslt, from, initialAdId } = useLocalSearchParams();
  const currentUser = useCurrentUser();
  const currentUserAuthMethod = getCurrentUserAuthMethod(currentUser);
  const queryClient = useQueryClient();
  const { incrementAdClics } = useIncrementAdClics();

  const initialAd: AnnouncementType | null = React.useMemo(() => {
    if (initialRslt) {
      try {
        return JSON.parse(decodeURIComponent(initialRslt as string));
      } catch {
        return null;
      }
    }

    if (initialAdId) {
      return (
        (queryClient.getQueryData(["ad", initialAdId]) as AnnouncementType) ??
        null
      );
    }

    return null;
  }, [initialRslt, initialAdId, queryClient]);

  const adId = initialAd?.id ?? (initialAdId as string | undefined);

  const { data: ad } = useQuery({
    queryKey: ["ad", adId],
    queryFn: async () => {
      try {
        const fetchedAd = await getAdById(adId as string);
        return fetchedAd ?? (initialAd as AnnouncementType);
      } catch {
        return initialAd as AnnouncementType;
      }
    },
    enabled: !!adId,
    initialData: () =>
      queryClient.getQueryData(["ad", adId]) ?? initialAd ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    networkMode: "offlineFirst",
  });

  const currentAd = ad ?? initialAd;

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
  }, [currentAd, incrementAdClics, from]);

  // removed early guard so the query can run and render from cache/fetch

  const safeTitle = currentAd?.title ?? "Annonce";
  const safePrice = currentAd?.price != null ? String(currentAd.price) : "";

  // console.log(ad?.address);

  if (!currentAd)
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" color={designSystem.colors.primary} />
      </View>
    );

  return (
    <Container withBottom onBackPress={() => router.navigate("/(tabs)/Home")}>
      {/* {(isLoading || !ad) && <AppFullScreenLoader />}
      {!isLoading && ad && (
        <> */}
      {/* header */}
      <AnnouncementDetailsHeaderSection
        from={from as "OtherPage" | "ProfilePage"}
        status={currentAd?.status as AdStatusType}
        name={
          safeTitle.length > 15 ? safeTitle.slice(0, 15) + "..." : safeTitle
        }
        adId={currentAd?.id as string}
        adTitle={currentAd.title}
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

            {/* Adresse map */}
            {currentAd?.address && (
              <AnnouncementDetailsAddressSection address={currentAd?.address} />
            )}

            {/*profile */}
            {from === "OtherPage" && (
              <AnnouncementDetailsProfileSection
                userId={currentAd?.userId as string}
              />
            )}

            {/* share */}
            {currentAd.status === "ACTIVATED" && (
              <AnnouncementDetailsShareSection
                from={from as string}
                adId={currentAd.id}
                adTitle={currentAd.title}
              />
            )}

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
          adTitle={safeTitle}
          adPrice={safePrice}
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
