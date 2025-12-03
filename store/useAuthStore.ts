import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  userIsLogged: boolean;
  userNameIsAdded: boolean;
  setUserIsLogged: (value: boolean) => void;
  setUserNameIsAdded: (value: boolean) => void;
  initAuthState: () => Promise<void>;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      userIsLogged: false,
      userNameIsAdded: false,
      setUserIsLogged: (value) => set({ userIsLogged: value }),
      setUserNameIsAdded: (value) => set({ userNameIsAdded: value }),

      initAuthState: async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          set({ userIsLogged: false, userNameIsAdded: false });
          return;
        }

        const userUuid = currentUser.uid;

        set({ userIsLogged: true });

        try {
          const user = await firestore()
            .collection("Users")
            .doc(userUuid)
            .get();

          const userName = user.data()?.userName;

          if (userName) {
            set({ userNameIsAdded: true });
          } else {
            set({ userNameIsAdded: false });
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du user:", error);
          set({ userNameIsAdded: false });
        }
      },
    }),
    {
      name: "auth_storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
