import PageHeader from "@/components/PageHeader";
import { useCheckUserAcces } from "@/hooks/services/auth/useCheckUserAcces";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Heart, Share2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnnouncementDetailsHeaderSection({
  from,
  status,
  name,
}: {
  from: "OtherPage" | "ProfilePage";
  status?: "inSell" | "disabled";
  name?: string;
}) {
  const { designSystem } = useAppTheme();

  const [selected, setSelected] = React.useState(false);

  const { checkUserAccess } = useCheckUserAcces();

  return (
    <PageHeader style={{ paddingHorizontal: 20 }} name={name}>
      <View style={styles.rightIcons}>
        {from === "OtherPage" && (
          <TouchableOpacity
            onPress={() => checkUserAccess(() => setSelected(!selected))}
            hitSlop={10}
          >
            <Heart
              fill={selected ? designSystem.colors.primary : "transparent"}
              size={22}
              color={designSystem.colors.primary}
            />
          </TouchableOpacity>
        )}

        {status !== "disabled" && (
          <TouchableOpacity hitSlop={10}>
            <Share2 size={22} color={designSystem.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </PageHeader>
  );
}

const styles = StyleSheet.create({
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
