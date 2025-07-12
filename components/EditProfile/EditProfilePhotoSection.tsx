import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfilePhotoSection() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission requise pour accéder à vos photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <AppText font="Medium" fontSize={15} style={styles.title}>
        Modifier la photo de profil
      </AppText>
      <Pressable onPress={pickImage} style={styles.imageWrapper}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : {
                  uri: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
                }
          }
          style={styles.profileImage}
        />
        <View style={styles.editBadge}>
          <Text style={styles.editText}>📷</Text>
        </View>
      </Pressable>
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
