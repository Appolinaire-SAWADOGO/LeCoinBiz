import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const ifUserIsConnected = () => {
  const auth = getAuth();
  if (auth.currentUser) return true;
  return false;
};

export const checkIfUserNameIsAdded = async (uuid: string) => {
  if (!uuid) {
    console.log("no uuid");
    return false;
  }

  console.log("uuid", uuid);

  const user = await firestore().collection("Users").doc(uuid).get();

  if (!user.exists) {
    console.log("no user");
    return false;
  }

  const userData = user.data();

  if (userData?.userName) return true;
  return false;
};
