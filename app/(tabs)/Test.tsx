import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import AppFullModal from "@/components/modals/AppFullModal";
import { useBackPress } from "@/hooks/useBackPress";
import { useAddYourUsernameModalStore } from "@/store/useAddYourUsernameModalStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Test() {
  const [city, setCity] = React.useState<any>();

  const insets = useSafeAreaInsets();

  const auth = getAuth();

  console.log("auth.currentUser.uid", auth.currentUser?.uid);

  useEffect(() => {
    const getCity = async () => {
      const city = await AsyncStorage.getItem("user_location");
      if (city) {
        setCity(city);
        console.log("city", city);
      } else {
        console.log("no city");
      }
    };

    getCity();
  }, []);

  useEffect(() => {
    (async () => {
      if (auth.currentUser?.uid) {
        console.log("auth.currentUser.uid", auth.currentUser.uid);

        const user = await firestore()
          .collection("Users")
          .doc(auth.currentUser.uid)
          .get();

        if (user.exists!) {
          const userData = user.data();
          console.log("User data:", userData);
        } else {
          console.log("Aucun utilisateur trouvé avec cet ID");
        }

        const users = await firestore().collection("Users").get();

        const allUsers = users.docs.map((doc) => ({
          id: doc.id, // identifiant du document (souvent le uuid)
          ...doc.data(), // les données du document
        }));

        console.log("Users data:", JSON.stringify(allUsers, null, 2));
      } else {
        console.log("no user");
      }
    })();
  }, [auth.currentUser?.uid]);

  const { onOpen: onOpenAuthModal } = useAuthModalStore();
  const [open, setOpen] = useState(false);
  const { onOpen: onOpenAddUsernameModal } = useAddYourUsernameModalStore();

  useBackPress(() => console.log("Hello"));

  return (
    <Container>
      <TouchableOpacity
        onPress={() => AsyncStorage.removeItem("user_location")}
      >
        <AppText>Delete user loc</AppText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(root)/Notifications")}>
        <AppText>Notifications</AppText>
      </TouchableOpacity>
      <AppText>city :{city}</AppText>
      <AppText>userId :{auth.currentUser?.uid}</AppText>
      <TouchableOpacity onPress={() => onOpenAuthModal()}>
        <AppText>open auth</AppText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <AppText>open</AppText>
      </TouchableOpacity>

      <AppFullModal isOpen={open} setIsOpen={setOpen} onClose={() => {}}>
        <AppText>test</AppText>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setOpen(false)}
        >
          <AppText>close</AppText>
        </TouchableOpacity>
      </AppFullModal>
    </Container>
  );
}
