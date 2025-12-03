import { useAuthStore } from "@/store/useAuthStore";
import { showToast } from "@/utils";
import { getAuth, signOut } from "@react-native-firebase/auth";

export const useSignOut = () => {
  const { setUserIsLogged, setUserNameIsAdded } = useAuthStore();

  const disconnect = async () => {
    const auth = getAuth();

    if (!auth) return;

    await signOut(auth)
      .then(() => {
        setUserIsLogged(false);
        setUserNameIsAdded(false);
        showToast("success", "Déconnexion réussie.");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
        showToast("error", "Une erreur est survenue.");
      });
  };

  return { disconnect };
};
