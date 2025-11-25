import React from "react";
import { TouchableOpacity } from "react-native";
import CopyLinkDynSvg from "../svg/social-media/CopyLinkDynSvg";
import FacebookDynSvg from "../svg/social-media/FacebookDynSvg";
import TwitterDynSvg from "../svg/social-media/TwitterDynSvg";
import WattsAppDynSvg from "../svg/social-media/WattsAppDynSvg";

export default function AnnouncementDetailsShareElmtCard({
  label,
  onPress,
}: {
  label: "facebook" | "twitter" | "whatsapp" | "copyLink";
  onPress?: () => void;
}) {
  const Icon = {
    facebook: FacebookDynSvg,
    twitter: TwitterDynSvg,
    whatsapp: WattsAppDynSvg,
    copyLink: CopyLinkDynSvg,
  }[label];

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <Icon />
    </TouchableOpacity>
  );
}
