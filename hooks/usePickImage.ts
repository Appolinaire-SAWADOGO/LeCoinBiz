import * as ImagePicker from "expo-image-picker";

export const usePickImage = () => {
  const pickImage = async (callBack: (img: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      callBack(result.assets[0].uri);
    }
  };

  return { pickImage };
};
