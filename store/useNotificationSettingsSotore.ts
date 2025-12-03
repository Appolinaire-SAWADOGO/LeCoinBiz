import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NotificationSettingsStoreState = {
  enabled: boolean;
  loading: boolean;
  isOpenModal: boolean;

  setLoading: (loading: boolean) => void;
  setEnabled: (enabled: boolean) => void;
  setIsOpenModal: (isOpen: boolean) => void;
  toggle: (value: boolean) => Promise<void>;
};

export const useNotificationSettingsStore = create(
  persist<NotificationSettingsStoreState>(
    (set) => ({
      enabled: false,
      loading: false,
      isOpenModal: false,
      setIsOpenModal: (isOpen: boolean) => set({ isOpenModal: isOpen }),
      setLoading: (loading: boolean) => set({ loading }),
      setEnabled: (enabled: boolean) => set({ enabled }),

      toggle: async (value) => {
        set({ loading: true });

        if (value === true) {
          const { status } = await Notifications.requestPermissionsAsync();

          if (status !== "granted") {
            set({ isOpenModal: true });
            return;
          }

          set({ enabled: true });

          try {
            const { data: token } = await Notifications.getExpoPushTokenAsync();
            console.log("📬 Expo Push Token :", token);
          } catch (e) {
            console.log("Token error :", e);
          }

          set({ loading: false });
        } else {
          set({ enabled: false, loading: false });
        }
      },
    }),
    {
      name: "notification_settings_storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
