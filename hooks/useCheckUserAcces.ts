import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useCheckUserAcces = () => {
  const { userIsLogged, userNameIsAdded } = useAuthStore();
  const { onOpen: onOpenAuthModal } = useAuthModalStore();
  const { onOpen: onOpenAddUsernameModal } = useAddYourUsernameModalStore();

  const checkUserAccess = (callBack?: () => void) => {
    if (!userIsLogged) {
      onOpenAuthModal();
      return;
    }

    if (!userNameIsAdded) {
      console.log("userNameIsAdded", userNameIsAdded);
      onOpenAddUsernameModal();
      return;
    }

    callBack?.();
  };

  return { checkUserAccess };
};
