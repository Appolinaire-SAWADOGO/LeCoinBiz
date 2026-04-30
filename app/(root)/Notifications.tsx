import NoData from "@/components/announcement/NoData";
import Container from "@/components/Container";
import NotificationCard from "@/components/Notification/NotificationCard";
import PageHeader from "@/components/PageHeader";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useGetNotifications } from "@/hooks/services/notifications/useGetNotifications";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useBackPress } from "@/hooks/useBackPress";
import {
  useAppNotificationStore,
  useNotificationStore,
} from "@/store/useNotificationStore";
import { NotificationType } from "@/types";
import { getTimeSinceCreated } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function Notifications() {
  const queryClient = useQueryClient();
  const { getNotifications } = useGetNotifications();
  const { setHasNotifications } = useNotificationStore();
  const { setIsAppNotificationBackground, isAppNotificationBackground } =
    useAppNotificationStore();

  const { designSystem } = useAppTheme();

  const [refreshing, setRefreshing] = React.useState(false);

  const userId = useCurrentUser()?.uid;

  const { data, isLoading, isFetching, isRefetching } = useQuery<
    NotificationType[]
  >({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(),

    staleTime: Infinity, // ✅ Les données ne deviennent JAMAIS stale
    gcTime: Infinity, // ✅ Les données ne sont JAMAIS supprimées du cache

    refetchOnWindowFocus: false, // ✅ Pas de refetch au focus
    refetchOnMount: false, // ✅ Pas de refetch au montage
    refetchOnReconnect: false, // ✅ Pas de refetch lors de la reconnexion
    retry: 2,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["notifications", userId],
    });
    setHasNotifications(false);
    setRefreshing(false);
  }, [queryClient]);

  useEffect(() => {
    setHasNotifications(false);
  }, [isFetching, isLoading, refreshing]);

  useEffect(() => {
    if (isAppNotificationBackground) {
      setIsAppNotificationBackground(false);
      onRefresh();
    }
  }, [isAppNotificationBackground]);

  useBackPress(() => {
    router.replace("/(tabs)/Home");
    return;
  });

  return (
    <Container>
      <PageHeader
        name="Notifications"
        style={{ paddingHorizontal: 20 }}
        onBack={() => router.replace("/(tabs)/Home")}
      />

      {!isLoading && !isFetching && (data?.length ?? 0) === 0 && (
        <NoData
          style={{ paddingTop: "40%" }}
          text="Vous n'avez aucune notification pour le moment."
        />
      )}

      <FlatList
        data={data ?? []}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          gap: 15,
        }}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            message={item.body}
            createdAt={getTimeSinceCreated(item.createdAt)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading || isFetching || isRefetching}
            onRefresh={onRefresh}
            colors={[designSystem.colors.primary]}
            tintColor={designSystem.colors.primary}
          />
        }
      />
    </Container>
  );
}
