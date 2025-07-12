import { create } from "zustand";
import * as Network from "expo-network";

type NetworkStore = {
  isConnected: boolean;
  initialized: boolean;
  initNetwokListener: () => void;
};

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  isConnected: false,
  initialized: false,
  initNetwokListener: () => {
    if (get().initialized) return;

    // initial check
    Network.getNetworkStateAsync().then((status) => {
      set({
        isConnected:
          status.isConnected! && status.isInternetReachable! !== false,
        initialized: true,
      });
    });

    // listener
    Network.addNetworkStateListener((status) => {
      set({
        isConnected:
          status.isConnected! && status.isInternetReachable! !== false,
      });
    });

    set({ initialized: true });
  },
}));
