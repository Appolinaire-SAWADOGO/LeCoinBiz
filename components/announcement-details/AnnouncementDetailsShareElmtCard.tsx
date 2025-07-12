import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CopyLinkDynSvg from "../svg/social-media/CopyLinkDynSvg";
import FacebookDynSvg from "../svg/social-media/FacebookDynSvg";
import TwitterDynSvg from "../svg/social-media/TwitterDynSvg";
import WattsAppDynSvg from "../svg/social-media/WattsAppDynSvg";

export default function AnnouncementDetailsShareElmtCard({
  label,
}: {
  label: "facebook" | "twitter" | "whatsapp" | "copyLink";
}) {
  const Icon = {
    facebook: FacebookDynSvg,
    twitter: TwitterDynSvg,
    whatsapp: WattsAppDynSvg,
    copyLink: CopyLinkDynSvg,
  }[label];

  return (
    <TouchableOpacity>
      <Icon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // button: {
  //   borderRadius: 50,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: 40,
  //   height: 40,
  // },
});
