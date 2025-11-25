import { DEFAULT_PROFILE_IMG } from "@/constants";
import { usePickImage } from "@/hooks/usePickImage";
import { Edit3, Trash2 } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfileImageSection({
  value,
  onChange,
  userImg,
}: {
  value: string;
  onChange: (url: string) => void;
  userImg: string;
}) {
  const { pickImage } = usePickImage();

  return (
    <View style={styles.container}>
      <AppText font="Medium" fontSize={15} style={styles.title}>
        Photo de profil
      </AppText>
      <TouchableOpacity
        onPress={async () => await pickImage((img: string) => onChange(img))}
        style={styles.imageWrapper}
      >
        <Image
          source={{
            uri: value || DEFAULT_PROFILE_IMG,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          activeOpacity={value ? 0.5 : 1}
          onPress={() => value && onChange("")}
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
  container: { alignItems: "center" },
  title: { marginBottom: 10 },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 120,
    height: 120,
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
