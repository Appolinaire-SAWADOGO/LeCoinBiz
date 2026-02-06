import AppText from "@/components/custom/AppText";
import SimilarAnnoucements from "@/components/similar-annoucements.tsx/SimilarAnnoucements";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useGetSimilarAds } from "@/hooks/services/ads/useGetSimilarsAds";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Composant Skeleton pour une carte d'annonce
function AnnouncementCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      {/* Image skeleton */}
      <Skeleton
        variant="rounded"
        style={{
          width: "100%",
          height: 160,
        }}
      />

      {/* Content skeleton */}
      <VStack space="sm" style={{ padding: 10 }}>
        {/* Prix */}
        <SkeletonText
          _lines={1}
          style={{
            width: "70%",
            height: 10,
          }}
        />

        {/* Titre */}
        <SkeletonText
          _lines={1}
          style={{
            width: "90%",
            height: 10,
          }}
        />

        {/* Ville */}
        <SkeletonText
          _lines={1}
          style={{
            width: "50%",
            height: 10,
            marginTop: 4,
          }}
        />

        {/* Date */}
        <SkeletonText
          _lines={1}
          style={{
            width: "60%",
            height: 10,
            marginTop: 4,
          }}
        />
      </VStack>
    </View>
  );
}

export default function AnnouncementDetailsSimilarsAdSection({
  ad,
}: {
  ad: AnnouncementType;
}) {
  const { designSystem } = useAppTheme();

  const { getSimilarAds } = useGetSimilarAds();

  const { data: similarsAds, isLoading } = useQuery({
    queryKey: ["similars-ads", ad.id],
    queryFn: () =>
      getSimilarAds({
        currentAdId: ad.id as string,
        title: ad.title as string,
        category: ad.category as string,
        subCategory: ad.subCategory as string,
        conditions: ad.conditions as string[],
        description: ad.description as string,
        userId: ad.userId as string,
        maxResults: 5,
      }),
    enabled: !!ad,
  });

  return (
    <View style={styles.container}>
      <AppText
        fontSize={16}
        font="Medium"
        color={designSystem.colors.bigText}
        style={styles.title}
      >
        Annonces similaires
      </AppText>

      {!similarsAds?.length  && !isLoading && ( <View style={{ paddingHorizontal: 20, marginTop: 40  , width: '100%' , justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{textAlign: "center"}} color={designSystem.colors.subText}>
          Aucune annonce similaire trouvée pour le moment.
        </AppText>
      </View> )}

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
        >
          {[1, 2, 3].map((item) => (
            <AnnouncementCardSkeleton key={item} />
          ))}
        </ScrollView>
      ) : (
        <SimilarAnnoucements
          data={similarsAds!}
          style={{ paddingHorizontal: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -20,
    paddingVertical: 16,
  },
  title: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});

const skeletonStyles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
    marginBottom: 6,
  },
});
