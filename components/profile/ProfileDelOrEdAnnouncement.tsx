import AppDropDownPicker from "@/components/custom/picker/AppDropDownPicker";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import {
  Edit3,
  EllipsisVertical,
  Eye,
  EyeOff,
  Trash,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useActivateAd } from "@/hooks/services/ads/useActivateAd";
import { useDeleteAd } from "@/hooks/services/ads/useDeleteAd";
import { useDisableAd } from "@/hooks/services/ads/useDisableAd";
import { AdStatusType, AnnouncementType } from "@/types";
import AppText from "../custom/AppText";
import AppCenterModal from "../modals/AppCenterModal";

export default function ProfileDelOrEdAnnouncement({
  status,
  adId,
  ad,
  openAdId,
  setOpenAdId,
}: {
  status: AdStatusType;
  adId: string;
  ad: AnnouncementType;
  openAdId?: string | null;
  setOpenAdId?: (id: string | null) => void;
}) {
  const isOpen = openAdId === adId;

  const { designSystem } = useAppTheme();

  const { disableAd } = useDisableAd();
  const { activateAd } = useActivateAd();
  const { deleteAd } = useDeleteAd();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const pendingAction = React.useRef<(() => void) | null>(null);

  const handleActionWithWarning = (action: () => void) => {
    pendingAction.current = action;
    setIsModalOpen(true);
  };

  const actions = [
    {
      label: "Modifier",
      value: "edit",
      icon: <Edit3 size={14} color={designSystem.colors.primary} />,
      onPress: () =>
        router.navigate({
          pathname: "/(root)/(announcement)/PostAnAd",
          params: {
            ad: encodeURIComponent(JSON.stringify(ad)),
            from: "NORMAL",
          },
        }),
    },

    ...(status === "ACTIVATED"
      ? [
          {
            label: "Désactiver",
            value: "disable",
            icon: <EyeOff size={14} color="#dc3545" />,
            onPress: async () => await disableAd(adId, ad.userId, "NORMAL"),
          },
        ]
      : []),

    ...(status === "DISABLED"
      ? [
          {
            label: "Réactiver",
            value: "reactivate",
            icon: <Eye size={14} color={designSystem.colors.primary} />,
            onPress: async () => await activateAd(adId, ad.userId, "NORMAL"),
          },
        ]
      : []),

    ...(status === "DISABLED" || status === "PENDING"
      ? [
          {
            label: "Supprimer",
            value: "delete",
            icon: <Trash size={14} color="#dc3545" />,
            onPress: () =>
              handleActionWithWarning(
                async () =>
                  await deleteAd(
                    adId,
                    ad.userId,
                    ad.images,
                    status,
                    "NORMAL",
                    ad.video,
                  ),
              ),
          },
        ]
      : []),
  ];

  const mappedItems = actions.map((a) => ({
    label: a.label,
    value: a.value,
  }));

  const handleToggle = () => {
    setOpenAdId?.(isOpen ? null : adId);
  };

  return (
    <>
      {/* Alert modal  */}
      <AppCenterModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Alerte"
        titleSize="lg"
        xSize="xl"
        submitText="Ok"
        footerStyle={{ justifyContent: "center" }}
        onSubmit={async () => {
          setIsModalOpen(false);

          if (pendingAction.current) {
            pendingAction.current();
            pendingAction.current = null;
          }
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <AppText style={{ fontSize: 16, lineHeight: 22, color: "#333" }}>
            Voulez-vous vraiment supprimer cette annonce ?
          </AppText>
        </View>
      </AppCenterModal>

      <View style={styles.wrapper}>
        {/* Bouton menu */}
        <TouchableOpacity style={styles.menuButton} onPress={handleToggle}>
          <EllipsisVertical size={16} color={designSystem.colors.bigText} />
        </TouchableOpacity>

        {/* Dropdown custom */}
        <AppDropDownPicker
          open={isOpen}
          value={null}
          items={mappedItems}
          setOpen={(open) => setOpenAdId?.(open ? adId : null)}
          setValue={() => {}}
          withSearch={false}
          showTickIcon={false}
          listMode="SCROLLVIEW"
          style={{ display: "none" }}
          dropDownContainerStyle={{
            width: 100,
            borderRadius: 8,
            borderColor: designSystem.colors.inputBorder,
            position: "absolute",
            top: 50,
            right: 12,
          }}
          onSelectItem={(item) => {
            const found = actions.find((a) => a.value === item.value);
            if (found) found.onPress();
            setOpenAdId?.(null);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  menuButton: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 12,
    right: 12,
  },
});
