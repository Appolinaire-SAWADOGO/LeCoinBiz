import { authEvents } from "@/utils/EventEmitter";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

/**
 * Hook pour obtenir le currentUser et être automatiquement notifié
 * quand il change (connexion, déconnexion, signOut, etc.)
 */
export const useCurrentUser = (): FirebaseAuthTypes.User | null => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    getAuth().currentUser
  );

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const onProfileUpdated = async () => {
      await auth.currentUser?.reload();
      setCurrentUser(auth.currentUser);
    };

    authEvents.on("profile_updated", onProfileUpdated);

    return () => {
      unsubscribeFirebase();
      authEvents.remove("profile_updated", onProfileUpdated);
    };
  }, []);

  return currentUser;
};
