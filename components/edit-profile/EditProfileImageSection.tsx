import { DEFAULT_PROFILE_IMG } from "@/constants";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { useAppTheme } from "@/hooks/useAppTheme";
import { usePickImage } from "@/hooks/usePickImage";
import { Edit3, Trash2 } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfileImageSection({
  userImg,
}: {
  userImg: string;
}) {
  const { pickImage } = usePickImage();
  const { designSystem } = useAppTheme();

  const [value, setValue] = React.useState<string>(userImg);

  const { editImage } = useEditProfile();

  const handlePickImage = async () => {
    await pickImage(
      async (img: string) => await editImage(value, img, setValue),
    );
  };

  return (
    <View style={[styles.container]}>
      <AppText font="Medium">Photo de profil</AppText>

      <TouchableOpacity onPress={handlePickImage} style={styles.imageWrapper}>
        <Image
          source={{
            uri: value || DEFAULT_PROFILE_IMG,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          activeOpacity={value ? 0.5 : 1}
          onPress={async () =>
            value ? await editImage(value, "", setValue) : handlePickImage()
          }
          style={styles.editBadge}
        >
          <Text style={styles.editText}>
            {value ? <Trash2 strokeWidth={1.3} /> : <Edit3 strokeWidth={1.3} />}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 8 },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  editText: { fontSize: 16 },
});
