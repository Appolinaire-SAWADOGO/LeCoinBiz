import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      {/* Écrans de groupes */}
      <Stack.Screen name="(announcement)/AnnouncementDetails" />
      <Stack.Screen name="(announcement)/PostAnAd" />
      <Stack.Screen name="(category)/AllCategories" />
      <Stack.Screen name="(settings)/About" />
      <Stack.Screen name="(settings)/HelpSupport" />
      <Stack.Screen name="(settings)/PostingRules" />
      <Stack.Screen name="(settings)/PrivacyPolicy" />
      <Stack.Screen name="(settings)/SecurityTips" />
      <Stack.Screen name="(settings)/TermsOfUs" />

      {/* Écrans directs */}
      <Stack.Screen name="ChooseCity" />
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="Filters" />
      <Stack.Screen name="MerchantProfile" />
      <Stack.Screen name="Notifications" />
    </Stack>
  );
}
