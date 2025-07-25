import ProfileContainer from "@/components/profile/ProfileContainer";
import ProfileInfoSection from "@/components/profile/ProfileInfoSection";
import ProfilePageTitleSection from "@/components/profile/ProfilePageTitleSection";
import { announcements } from "@/constants/announcements";
import React from "react";

export default function Index() {
  return (
    <ProfileContainer
      titleSection={<ProfilePageTitleSection />}
      infoSection={<ProfileInfoSection />}
      data={announcements}
      useCase="profile"
      mandatoryLogin
    />
  );
}
