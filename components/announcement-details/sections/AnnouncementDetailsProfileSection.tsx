import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { DEFAULT_PROFILE_IMG } from "@/constants";
import { useGetUserAdsCount } from "@/hooks/services/ads/useGetUserAdsCount";
import { useGetUserById } from "@/hooks/services/user/useGetUserById";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsProfileSection({
  userId,
}: {
  userId: string;
}) {
  const { designSystem } = useAppTheme();

  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId as string),
    enabled: !!userId,
    retry: false,
    networkMode: "offlineFirst",
  });

  const { data: userAdsCount, isLoading: userAdsCountIsLoading } = useQuery({
    queryKey: ["userAdsCount", userId],
    queryFn: () => getUserAdsCount(userId as string),
    enabled: !!userId,
    retry: false,
    networkMode: "offlineFirst",
  });

  const isLoading = userIsLoading || userAdsCountIsLoading;

  if (!isLoading && !user) return null;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton
          variant="circular"
          style={{
            width: 40,
            height: 40,
            marginRight: 12,
          }}
        />

        <VStack space="sm" className="flex-1">
          <SkeletonText _lines={1} style={{ width: 200, height: 10 }} />

          <HStack space="md" style={{ marginTop: 1 }}>
            <SkeletonText _lines={1} style={{ width: 90, height: 10 }} />
            <SkeletonText _lines={1} style={{ width: 90, height: 10 }} />
          </HStack>
        </VStack>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/(root)/MerchantProfile",
          params: {
            userRslt: encodeURIComponent(JSON.stringify(user)),
            userAdsCountRslt: userAdsCount,
          },
        })
      }
      style={styles.container}
    >
      <Image
        source={{
          uri: user?.image || DEFAULT_PROFILE_IMG,
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        {/* Nom */}
        <AppText
          font="Medium"
          fontSize={17}
          color={designSystem.colors.bigText}
          style={{ marginBottom: 2 }}
        >
          {user?.userName}
        </AppText>

        {/* Lieu et annonces */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={designSystem.colors.subText}
            />
            <AppText
              style={{
                fontSize: 12.9,
                color: designSystem.colors.subText,
                textTransform: "capitalize",
              }}
            >
              {user?.location.city}
            </AppText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={15}
              color={designSystem.colors.subText}
            />
            <AppText
              style={{ fontSize: 13, color: designSystem.colors.subText }}
            >
              {userAdsCount} Annonces
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderColor: "#E5E5E5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    objectFit: "cover",
  },
});
