import { useFocusEffect } from "expo-router";
import React from "react";
import { BackHandler } from "react-native";

export const useBackPress = (callBack: () => void) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Empêche le retour et quitte l'app si on est sur Home
        // Alert.alert("Quitter l'application", "Voulez-vous vraiment quitter ?", [
        //   { text: "Annuler", style: "cancel" },
        //   { text: "Oui", onPress: () => BackHandler.exitApp() },
        // ]);

        callBack();
        return true; // Important : bloque le comportement par défaut
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );
};
