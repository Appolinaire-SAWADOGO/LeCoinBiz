import { useFocusEffect } from "expo-router";
import React from "react";
import { BackHandler } from "react-native";

export const useBackPress = (callBack: () => void) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        callBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );
};
