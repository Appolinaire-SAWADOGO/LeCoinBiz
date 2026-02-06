import AppText from "@/components/custom/AppText";
import AppCenterModal from "@/components/modals/AppCenterModal";
import { useDeleteAccount } from "@/hooks/services/auth/signIn/useDeleteAccount";
import { useSignOut } from "@/hooks/services/auth/signIn/useSignOut";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function SettingsLogoutAndDelAcntSection() {
  const { designSystem } = useAppTheme();

  const { disconnect, isLoading: disconnectIsLoading } = useSignOut();
  const { deleteAccount, isLoading: deleteAccountIsloading } =
    useDeleteAccount();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [actionName, setActionName] = React.useState<
    "supprimer" | "deconnecter"
  >();
  const pendingAction = React.useRef<(() => void) | null>(null);

  const handleActionWithWarning = async (action: () => void) => {
    pendingAction.current = action;
    setIsModalOpen(true);
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
            {actionName === "supprimer"
              ? "Voulez-vous vraiment supprimer votre compte ?"
              : "Voulez-vous vraiment vous déconnecter de votre compte ?"}
          </AppText>
        </View>
      </AppCenterModal>

      <View
        style={{
          gap: 16,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          disabled={disconnectIsLoading}
          onPress={() => {
            setActionName("deconnecter");
            handleActionWithWarning(disconnect);
          }}
        >
          <AppText
            font="Medium"
            fontSize={15}
            style={{ opacity: disconnectIsLoading ? 0.5 : 1 }}
          >
            Se deconnecter
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={deleteAccountIsloading}
          onPress={() => {
            setActionName("supprimer");
            handleActionWithWarning(deleteAccount);
          }}
        >
          <AppText
            font="Medium"
            fontSize={15}
            color={designSystem.colors.subText}
            style={{ opacity: deleteAccountIsloading ? 0.5 : 1 }}
          >
            Supprimez votre compte
          </AppText>
        </TouchableOpacity>
      </View>
    </>
  );
}
