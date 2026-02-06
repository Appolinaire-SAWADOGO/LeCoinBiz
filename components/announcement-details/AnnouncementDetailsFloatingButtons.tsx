import { useActivateAd } from "@/hooks/services/ads/useActivateAd";
import { useDeleteAd } from "@/hooks/services/ads/useDeleteAd";
import { useDisableAd } from "@/hooks/services/ads/useDisableAd";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, AnnouncementType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SMS from "expo-sms";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../custom/AppText";
import AppCenterModal from "../modals/AppCenterModal";
import { HStack } from "../ui/hstack";
import { Switch } from "../ui/switch";
import AnnouncementDetailsFloatingButtonsCard from "./AnnouncementDetailsFloatingButtonsCard";

export default function AnnouncementDetailsFloatingButtons({
  from,
  status,
  whattsAppNumber,
  phoneNumber,
  ad,
  adId,
  adImage,
  adTitle,
  adPrice,
  adCategory,
  adSubCategory,
  adTempUb,
}: {
  from: "OtherPage" | "ProfilePage";
  status?: AdStatusType;
  whattsAppNumber?: string;
  phoneNumber?: string;
  ad: AnnouncementType;
  adId: string;
  adImage: string;
  adTitle: string;
  adPrice: string;
  adCategory: string;
  adSubCategory: string;
  adTempUb: string;
}) {
  const insets = useSafeAreaInsets();

  const message = `
Bonjour,

Je suis intéressé(e) par votre annonce : 

- Titre : ${adTitle}
- Catégorie : ${adCategory}
- Sous-catégorie : ${adSubCategory}
- Prix : ${adPrice} FCFA
- Publiée le : ${adTempUb}
- Image : ${adImage}

Pourriez-vous me donner plus d’informations ou convenir d’un rendez-vous pour en discuter ?

Merci beaucoup et bonne journée !
`;

  const [footerHeight, setFooterHeight] = React.useState(0);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");

  const [switchValue, setSwitchValue] = React.useState(false);

  const { designSystem } = useAppTheme();

  const pendingAction = React.useRef<(() => void) | null>(null);

  const handleActionWithWarning = async (action: () => void) => {
    try {
      const value = await AsyncStorage.getItem(
        "no_longer_called_ad_detail_warning",
      );

      if (value === "true") {
        action();
      } else {
        setModalMessage(
          "Ne donnez jamais d’argent au vendeur sans voir physiquement le produit. " +
            "Privilégiez les rencontres en personne. Nous ne sommes pas responsables des problèmes " +
            "entre acheteurs et vendeurs. Nous servons uniquement d’intermédiaire.",
        );

        pendingAction.current = action;

        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du stockage :", error);
    }
  };

  const openWhatsApp = async () => {
    if (from !== "OtherPage" || !whattsAppNumber) return;

    const cleanNumber = whattsAppNumber.replace(/[^0-9]/g, "");

    const url = `https://wa.me/226${cleanNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch((err) => {
      console.error(err);
      setModalMessage("WhatsApp n'est pas installé sur ce téléphone");
      setIsModalOpen(true);
    });
  };

  const sendSMS = async () => {
    if (from !== "OtherPage" || !phoneNumber) return;

    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

    try {
      await SMS.sendSMSAsync([cleanNumber], message);
    } catch {
      setModalMessage(
        "Impossible d’ouvrir l’application SMS. Veuillez vérifier qu’elle est bien installée sur votre appareil.",
      );
      setIsModalOpen(true);
    }
  };

  const makeCall = () => {
    if (from !== "OtherPage" || !phoneNumber) return;

    const url = `tel:+226${phoneNumber}`;

    Linking.openURL(url).catch(() => {
      setModalMessage(
        "Impossible d’ouvrir l’application Téléphone. Vérifiez qu’elle est disponible sur votre appareil.",
      );
      setIsModalOpen(true);
    });
  };

  const { disableAd } = useDisableAd();
  const { activateAd } = useActivateAd();
  const { deleteAd } = useDeleteAd();

  return (
    <>
      {/* Alert modal  */}
      <AppCenterModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalMessage("");
        }}
        title="Alerte"
        titleSize="lg"
        xSize="xl"
        submitText="Ok"
        footerStyle={{ justifyContent: "center" }}
        onSubmit={async () => {
          setIsModalOpen(false);
          setModalMessage("");
          await AsyncStorage.setItem(
            "no_longer_called_ad_detail_warning",
            switchValue.toString(),
          );

          if (pendingAction.current) {
            pendingAction.current();
            pendingAction.current = null;
          }
        }}
      >
        {/* message */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <AppText style={styles.text}>{modalMessage}</AppText>
        </View>

        {/* Switch */}
        <HStack space="md" style={{ marginTop: 20, alignItems: "center" }}>
          <AppText style={styles.text} font="Medium">
            Ne plus rappeler
          </AppText>

          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            trackColor={{ false: "#d4d4d4", true: designSystem.colors.primary }}
            thumbColor="#fafafa"
            ios_backgroundColor="#d4d4d4"
          />
        </HStack>
      </AppCenterModal>

      <View
        style={[styles.footer, { bottom: footerHeight - 25 }]}
        onLayout={(e) => {
          setFooterHeight(e.nativeEvent.layout.height);
        }}
      >
        {from === "OtherPage" && (
          <>
            <AnnouncementDetailsFloatingButtonsCard
              useCase="watsApp"
              onPress={() => handleActionWithWarning(openWhatsApp)}
            />

            <AnnouncementDetailsFloatingButtonsCard
              useCase="sms"
              onPress={() => handleActionWithWarning(sendSMS)}
            />

            <AnnouncementDetailsFloatingButtonsCard
              useCase="call"
              onPress={() => handleActionWithWarning(makeCall)}
            />
          </>
        )}

        {from === "ProfilePage" && (
          <>
            <AnnouncementDetailsFloatingButtonsCard
              useCase="edit"
              onPress={() =>
                router.navigate({
                  pathname: "/(root)/(announcement)/PostAnAd",
                  params: { ad: JSON.stringify(ad), from: "AD_DETAILS" },
                })
              }
            />
            {status === "ACTIVATED" && (
              <AnnouncementDetailsFloatingButtonsCard
                useCase="disable"
                onPress={async () =>
                  await disableAd(adId, ad.userId, "AD_DETAILS")
                }
              />
            )}
            {status === "DISABLED" && (
              <AnnouncementDetailsFloatingButtonsCard
                useCase="enable"
                onPress={async () =>
                  await activateAd(adId, ad.userId, "AD_DETAILS")
                }
              />
            )}
            {status !== "ACTIVATED" && (
              <AnnouncementDetailsFloatingButtonsCard
                useCase="delete"
                onPress={async () =>
                  await deleteAd(
                    adId,
                    ad.userId,
                    ad.images,
                    ad.status,
                    "AD_DETAILS",
                  )
                }
              />
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },

  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
});
