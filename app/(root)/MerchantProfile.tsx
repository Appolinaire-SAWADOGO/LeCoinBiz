import MerchantInfoSection from "@/components/Merchand/MerchantInfoSection";
import PageHeader from "@/components/PageHeader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { announcements } from "@/constants/announcements";
import React from "react";

export default function MerchantProfile() {
  return (
    <ProfileContainer
      titleSection={
        <PageHeader name="Profile" style={{ paddingHorizontal: 20 }} />
      }
      infoSection={<MerchantInfoSection />}
      data={announcements}
      useCase="merchant"
      contentHeadTop={85}
    />
  );
}
