import { modifyAdToQueryData, showToast } from "@/utils";
import { authEvents } from "@/utils/EventEmitter";
import { firebasyeFunctions } from "@/utils/firebase";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import { useDeleteImgs } from "../ads/useDeleteImgs";
import { useUploadImgs } from "../ads/useUploadImgs";
import { useCurrentUser } from "../auth/signIn/useCurrentUser";

export const useEditProfile = () => {
  const currentUser = useCurrentUser();
  const userId = currentUser?.uid;

  const queryClient = useQueryClient();

  const { uploadImgs } = useUploadImgs();

  const { deleteImgs } = useDeleteImgs();

  const callUpdateProfile = async (data: Record<string, any>) => {
    try {
      const updateProfile = firebasyeFunctions.httpsCallable("editUserProfile");
      await updateProfile(data);
    } catch (error) {
      console.error(
        "une erreur est survenu l'ors de l'execution du cloud functions",
        error,
      );
    }
  };

  return {
    editImage: async (
      preImage: string,
      image: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      if (!setValue) {
        return null;
      }

      if (!userId) {
        showToast("error", "Connectez-vous pour mettre à jour votre profil.");
        return null;
      }

      showToast("loading", "Chargement...", 0);

      try {
        let uploadUrl = null as Array<string> | null;

        if (image) {
          uploadUrl = await uploadImgs([image], "ProfileImages");
        }

        await callUpdateProfile({ image: image ? uploadUrl?.[0] : image });

        if (preImage) await deleteImgs([preImage]);

        authEvents.emit("profile_updated");

        setValue(image ? uploadUrl?.[0]! : image);

        modifyAdToQueryData(
          ["user", userId, "profile"],
          { image: image ? uploadUrl?.[0] : image },
          queryClient,
        );

        Toast.hide();
        showToast("success", "Photo de profil mise à jour.");
      } catch (error) {
        Toast.hide();
        showToast("error", "Une erreur est survenue.");
        console.error(
          "Une erreur s'est produite lors de la mise à jour de la photo de profil.",
          error,
        );
      }
    },

    editFirstAndLastName: async (
      firstAndLastName: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      if (!firstAndLastName || !setValue) return null;

      if (!userId) {
        showToast("error", "Connectez-vous pour mettre à jour votre profil.");
        return null;
      }

      showToast("loading", "Chargement...", 0);

      try {
        await callUpdateProfile({ firstAndLastName });

        authEvents.emit("profile_updated");

        setValue(firstAndLastName);

        modifyAdToQueryData(
          ["user", userId, "profile"],
          { firstAndLastName },
          queryClient,
        );

        Toast.hide();
        showToast("success", "Nom et prénom mis à jour.");
      } catch (error) {
        Toast.hide();
        showToast("error", "Une erreur est survenue.");
        console.error(
          "Une erreur s'est produite lors de la mise à jour du nom et prenom.",
          error,
        );
      }
    },

    editUserName: async (
      userName: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      if (!userName || !setValue) return null;

      if (!userId) {
        showToast("error", "Connectez-vous pour mettre à jour votre profil.");
        return null;
      }

      showToast("loading", "Chargement...", 0);

      try {
        await callUpdateProfile({ userName });

        authEvents.emit("profile_updated");

        setValue(userName);

        modifyAdToQueryData(
          ["user", userId, "profile"],
          { userName },
          queryClient,
        );

        await currentUser.reload();

        Toast.hide();
        showToast("success", "Nom d'utilisateur mis à jour.");
      } catch (error) {
        Toast.hide();
        showToast("error", "Une erreur est survenue.");
        console.error(
          "Une erreur s'est produite lors de la mise à jour du nom d'utilisateur.",
          error,
        );
      }
    },

    editGender: async (
      gender: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      if (!gender || !setValue) return null;

      if (!userId) {
        showToast("error", "Connectez-vous pour mettre à jour votre profil.");
        return null;
      }

      showToast("loading", "Chargement...", 0);

      try {
        await callUpdateProfile({ gender });

        authEvents.emit("profile_updated");

        setValue(gender);

        modifyAdToQueryData(
          ["user", userId, "profile"],
          { gender },
          queryClient,
        );

        Toast.hide();
        showToast("success", "Genre mis à jour.");
      } catch (error) {
        Toast.hide();
        showToast("error", "Une erreur est survenue.");
        console.error(
          "Une erreur s'est produite lors de la mise à jour du genre.",
          error,
        );
      }
    },

    editDateOfBirth: async (
      dateOfBirth: Date,
      setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>,
    ) => {
      if (!setValue) return null;

      if (!userId) {
        showToast("error", "Connectez-vous pour mettre à jour votre profil.");
        return null;
      }

      showToast("loading", "Chargement...", 0);

      try {
        await callUpdateProfile({ dateOfBirth: dateOfBirth.toISOString() });

        authEvents.emit("profile_updated");

        setValue(dayjs(dateOfBirth));

        modifyAdToQueryData(
          ["user", userId, "profile"],
          {
            dateOfBirth: {
              _seconds: Math.floor(dateOfBirth.getTime() / 1000),
              _nanoseconds: (dateOfBirth.getTime() % 1000) * 1_000_000,
            },
          },
          queryClient,
        );

        Toast.hide();
        showToast("success", "Date de naissance mise à jour.");
      } catch (error) {
        Toast.hide();
        showToast("error", "Une erreur est survenue.");
        console.error(
          "Une erreur s'est produite lors de la mise à jour de la date de naissance.",
          error,
        );
      }
    },
  };
};
