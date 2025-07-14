import MerchantInfoSection from "@/components/Merchand/MerchantInfoSection";
import PageHeader from "@/components/PageHeader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { announcements } from "@/constants/announcements";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Heart } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function MerchantProfile() {
  const { designSystem } = useAppTheme();

  return (
    <ProfileContainer
      titleSection={
        <PageHeader name="Profile" style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity>
            <Heart size={22} color={designSystem.colors.primary} />
          </TouchableOpacity>
        </PageHeader>
      }
      infoSection={<MerchantInfoSection />}
      data={announcements}
      useCase="merchant"
      contentHeadTop={85}
    />
  );
}
