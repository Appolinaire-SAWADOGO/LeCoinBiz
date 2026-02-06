import { showToast } from "@/utils";
import {
  subscribeToGeneralTopic,
  subscribeToUserTopic,
  unsubscribeFromGeneralTopic,
  unsubscribeFromUserTopic,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NotificationSettingsStoreType = {
  enabled: boolean;
  isOpenModal: boolean;
  setEnabled: (enabled: boolean) => void;
  setIsOpenModal: (isOpen: boolean) => void;
  toggle: (value: boolean, userId: string | undefined) => Promise<void>;
};

export const useNotificationSettingsStore = create(
  persist<NotificationSettingsStoreType>(
    (set) => ({
      enabled: true,
      isOpenModal: false,
      setIsOpenModal: (isOpen: boolean) => set({ isOpenModal: isOpen }),
      setEnabled: (enabled: boolean) => set({ enabled }),

      toggle: async (value, userId) => {
        if (value === true) {
          const { status } = await Notifications.requestPermissionsAsync();

          if (status !== "granted") {
            set({ isOpenModal: true });
            return;
          }

          showToast("loading", "Activation en cours.");

          await subscribeToGeneralTopic();
          if (userId) await subscribeToUserTopic(userId);

          Toast.hide();
          set({ enabled: true });
        } else {
          showToast("loading", "Desactivation en cours.");

          await unsubscribeFromGeneralTopic();
          if (userId) await unsubscribeFromUserTopic(userId);

          Toast.hide();
          set({ enabled: false });
        }
      },
    }),
    {
      name: "notification_settings_store_storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
