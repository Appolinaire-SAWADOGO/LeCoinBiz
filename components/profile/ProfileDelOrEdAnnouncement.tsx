import { useAppTheme } from "@/hooks/useAppTheme";
import { Edit, Eye, EyeOff, Trash } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfileDelOrEdAnnouncement({
  status,
}: {
  status: "inSell" | "disabled";
}) {
  const { designSystem } = useAppTheme();
  const dangerColor = "#dc3545";

  return (
    <View style={styles.container}>
      {/* Modifier */}
      <TouchableOpacity style={styles.action}>
        <Edit size={14} color={designSystem.colors.primary} />
        <AppText fontSize={13} color={designSystem.colors.primary}>
          Modifier
        </AppText>
      </TouchableOpacity>

      {/* Désactiver ou Réactiver */}
      {status === "inSell" ? (
        <TouchableOpacity style={styles.action}>
          <EyeOff size={14} color={dangerColor} />
          <AppText fontSize={13} color={dangerColor}>
            Désactiver
          </AppText>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.action}>
            <Eye size={14} color={designSystem.colors.primary} />
            <AppText fontSize={13} color={designSystem.colors.primary}>
              Réactiver
            </AppText>
          </TouchableOpacity>

          {/* Supprimer uniquement si désactivée */}
          <TouchableOpacity style={styles.action}>
            <Trash size={14} color={dangerColor} />
            <AppText fontSize={13} color={dangerColor}>
              Supprimer
            </AppText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, marginBottom: 10, marginTop: 20 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
