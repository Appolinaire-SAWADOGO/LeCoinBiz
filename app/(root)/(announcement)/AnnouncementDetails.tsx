import AnnouncementDetailsFloatingButtons from "@/components/announcement-details/AnnouncementDetailsFloatingButtons";
import AnnouncementDetailsHeaderSection from "@/components/announcement-details/sections/AnnouncementDetailsHeaderSection";
import AnnouncementDetailsImagesSection from "@/components/announcement-details/sections/AnnouncementDetailsImagesSection";
import AnnouncementDetailsInfoSection from "@/components/announcement-details/sections/AnnouncementDetailsInfoSection";
import AnnouncementDetailsProfileSection from "@/components/announcement-details/sections/AnnouncementDetailsProfileSection";
import AnnouncementDetailsPublicationReportingSection from "@/components/announcement-details/sections/AnnouncementDetailsPublicationReportingSection";
import AnnouncementDetailsShareSection from "@/components/announcement-details/sections/AnnouncementDetailsShareSection";
import AnnouncementDetailsSimilarAdSection from "@/components/announcement-details/sections/AnnouncementDetailsSimilarAdSection";
import Container from "@/components/Container";
import { announcements } from "@/constants/announcements";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

export default function AnnouncementDetails() {
  const { designSystem } = useAppTheme();

  const { id, from, status } = useLocalSearchParams();
  const currentAnnouncement = announcements[Number(id) - 1];
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
    }
  );

  useEffect(() => {
    console.log("Page montée");
  }, []);

  return (
    <Container withBottom>
      {/* header */}
      <AnnouncementDetailsHeaderSection
        from={from as "OtherPage" | "ProfilePage"}
        status={status as "inSell" | "disabled"}
        name={currentAnnouncement.name.slice(0, 15) + "..."}
      />

      {/* main */}
      <View style={[styles.main]}>
        {/* scroll view*/}
        <ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Galerie d'images */}
          <AnnouncementDetailsImagesSection
            currentAnnouncement={currentAnnouncement}
          />

          {/* Section principale */}
          <View style={styles.mainContent}>
            {/* Announcement Details Info Section */}
            <AnnouncementDetailsInfoSection
              currentAnnouncement={currentAnnouncement}
              from={from as "OtherPage" | "ProfilePage"}
            />

            {/*profile */}
            {from === "OtherPage" && <AnnouncementDetailsProfileSection />}

            {status !== "disabled" && <AnnouncementDetailsShareSection />}

            {/* Avis */}
            {/* <AnnouncementDetailsReviewSection /> */}

            {/* add review */}
            {/* <AnnouncementDetailsAddReviewSection /> */}

            {/* similar ad  */}

            {/* report la publication and similar ad */}
            {from === "OtherPage" && (
              <>
                <AnnouncementDetailsSimilarAdSection />
                <AnnouncementDetailsPublicationReportingSection />
              </>
            )}
          </View>
        </ScrollView>

        {/* Boutons d'action flottants */}
        <AnnouncementDetailsFloatingButtons
          from={from as "OtherPage" | "ProfilePage"}
          status={status as "inSell" | "disabled"}
        />
      </View>
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
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
