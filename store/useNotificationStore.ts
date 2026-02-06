import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NotificationStoreType = {
  hasNotifications: boolean;
  setHasNotifications: (val: boolean) => void;
};

type AppNotificationType = {
  isAppNotificationClosed: boolean;
  setIsAppNotificationClosed: (val: boolean) => void;
  isAppNotificationBackground: boolean;
  setIsAppNotificationBackground: (val: boolean) => void;
};

export const useNotificationStore = create(
  persist<NotificationStoreType>(
    (set) => ({
      hasNotifications: false,
      setHasNotifications: (val: boolean) => set({ hasNotifications: val }),
    }),
    {
      name: "notification_store_storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useAppNotificationStore = create<AppNotificationType>((set) => ({
  isAppNotificationClosed: false,
  setIsAppNotificationClosed: (val: boolean) =>
    set({ isAppNotificationClosed: val }),
  isAppNotificationBackground: false,
  setIsAppNotificationBackground: (val: boolean) =>
    set({ isAppNotificationBackground: val }),
}));
