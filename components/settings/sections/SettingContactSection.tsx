import React from "react";
import { Linking } from "react-native";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";

export default function SettingContactSection() {
  return (
    <>
      <SettingsSectionContainer title=" Contact">
        <SettingElement
          icon="email"
          color="#7D5AFC"
          fill="none"
          label="Nous contacter par e-mail"
          onClick={() =>
            Linking.openURL("mailto:contact.lecoinbiz@gmail.com").catch(
              (err) => {
                console.error(
                  "Erreur lors de l'ouverture du client mail : ",
                  err,
                );
              },
            )
          }
        />
        <SettingElement
          icon="message-text"
          color="#2BB741"
          label="Nous contacter sur WhatsApp"
          onClick={() =>
            Linking.openURL("https://wa.me/22677976643").catch((err) => {
              console.error(
                "WhatsApp n'est pas installé sur ce téléphone : ",
                err,
              );
            })
          }
        />
        <SettingElement
          icon="facebook"
          color="#1877F2"
          size={22}
          label="Nous suivre sur Facebook"
          onClick={() =>
            Linking.openURL("https://www.facebook.com/share/1Ae57kVgHY/").catch(
              (err) => {
                console.error(
                  "Erreur lors de l'ouverture du client Facebook : ",
                  err,
                );
              },
            )
          }
        />
      </SettingsSectionContainer>
    </>
  );
}
