import firebase from "@react-native-firebase/app";
import { getFunctions } from "@react-native-firebase/functions";

export const firebaseFunctions = getFunctions(
  firebase.app(),
  "europe-southwest1",
);
