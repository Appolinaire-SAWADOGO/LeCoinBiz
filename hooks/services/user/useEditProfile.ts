import { showToast } from "@/functions";
import { EditProfileSchema } from "@/zod/schema/editProfile.schema";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

type FormData = z.infer<typeof EditProfileSchema>;

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  const editProfile = async (data: FormData) => {
    if (!data) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      showToast("error", "Aucun utilisateur connecté.");
      return;
    }

    showToast("loading", "Traitement en cours.");

    try {
      let uploadUrl = "" as string;

      if (data.image) {
        const formData = new FormData();

        const extension = data.image.split(".").pop();
        const mimeType = `image/${extension}`;

        formData.append("file", {
          uri: data.image,
          type: mimeType,
          name: `photo_${uuidv4()}.${extension}`,
        } as any);
        formData.append(
          "upload_preset",
          process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
        );
        formData.append("folder", "lecoinbiz/users");

        const res = await axios.post(
          process.env.EXPO_PUBLIC_CLOUDINARY_URL as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const json = await res.data;
        uploadUrl = json.secure_url;
      }

      const updateData = {
        image: uploadUrl,
        firstAndLastName: data.firstAndLastName ?? "",
        userName: data.userName ?? "",
        gender: data.gender ?? "",
        dateOfBirth: data.dateOfBirth
          ? firestore.Timestamp.fromDate(data.dateOfBirth)
          : null,
        phoneNumber: data.phoneNumber
          ? `+226${data.phoneNumber.replace(/^\+226/, "")}`
          : "",
        whatsappNumber: data.whatsappNumber
          ? `+226${data.whatsappNumber.replace(/^\+226/, "")}`
          : "",
        email: data.email ?? "",
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection("Users")
        .doc(currentUser.uid)
        .update(updateData);

      await queryClient.invalidateQueries({
        queryKey: ["user-data", currentUser.uid, "profile"],
      });

      Toast.hide();
      showToast("success", "Profil mis à jour.");
    } catch (error: any) {
      console.error("Erreur useEditProfile:", error);
      Toast.hide();
      showToast("error", "Une erreur est survenue.");
      return;
    }
  };

  return { editProfile };
};
