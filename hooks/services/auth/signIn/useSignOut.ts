import { useAuthStore } from "@/store/useAuthStore";
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
        console.log("Déconnexion réussie");
        // Tu peux rediriger vers la page de login par exemple :
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  return { disconnect };
};
