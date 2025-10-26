import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { X } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../custom/AppText";

export default function AppBottomModal({
  isOpen,
  setIsOpen,
  headerText,
  children,
  onClose,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  headerText: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Actionsheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose && onClose();
        }}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent
          style={[styles.modal, { paddingBottom: insets.bottom + 10 }]}
        >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={styles.header}>
            <AppText style={styles.title}>{headerText}</AppText>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                onClose && onClose();
              }}
            >
              <X color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
