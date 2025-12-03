// import Container from "@/components/Container";
// import AppText from "@/components/custom/AppText";
// import PageHeader from "@/components/PageHeader";
// import React from "react";
// import { View } from "react-native";

// export default function Notifications() {
//   return (
//     <Container>
//       <PageHeader name="Notifications" style={{ paddingHorizontal: 20 }} />
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <AppText>Pas de Notifications</AppText>
//       </View>
//     </Container>
//   );
// }

import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import { useNotification } from "@/context/NotificationContext";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, SafeAreaView, StatusBar } from "react-native";

export default function Notifications() {
  const { notification, expoPushToken, error } = useNotification();
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

  const [dummyState, setDummyState] = useState(0);

  if (error) {
    return <AppText>Error: {error.message}</AppText>;
  }

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      // Updates.reloadAsync();
      // setDummyState(dummyState + 1);
      // Alert.alert("Update downloaded and applied");

      dummyFunction();
    }
  }, [isUpdatePending]);

  const dummyFunction = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error");
    }

    // UNCOMMENT TO REPRODUCE EAS UPDATE ERROR
    // } finally {
    //   setDummyState(dummyState + 1);
    //   console.log("dummyFunction");
    // }
  };

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "This app is running from built-in code"
    : "This app is running an update";

  return (
    <Container
      withGoBack
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <AppText>Updates Demo 5</AppText>
        <AppText>{runTypeMessage}</AppText>
        <Button
          onPress={() => Updates.checkForUpdateAsync()}
          title="Check manually for updates"
        />
        {showDownloadButton ? (
          <Button
            onPress={() => Updates.fetchUpdateAsync()}
            title="Download and run update"
          />
        ) : null}
        <AppText>Your push token:</AppText>
        <AppText>{expoPushToken}</AppText>
        <AppText>Latest notification:</AppText>
        <AppText>{notification?.request.content.title}</AppText>
        <AppText>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </AppText>
      </SafeAreaView>
    </Container>
  );
}
