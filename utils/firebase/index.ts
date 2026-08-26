import firebase from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions } from "@react-native-firebase/functions";

export const firebaseFunctions = getFunctions(
  firebase.app(),
  "europe-southwest1",
);

export const firebaseFirestore = getFirestore(firebase.app());
