// import { X } from "lucide-react-native";
// import React from "react";
// import {
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function AppBottomModal({
//   isOpen,
//   setIsOpen,
//   headerText,
//   children,
// }: {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   headerText: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Modal animationType="slide" visible={isOpen} transparent>
//       <View style={[styles.overlay, { top: 0 }]}>
//         <View style={styles.modal}>
//           <View style={styles.header}>
//             <Text style={styles.title}>{headerText}</Text>
//             <TouchableOpacity onPress={() => setIsOpen(false)}>
//               <X color="#000" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView showsVerticalScrollIndicator={false}>
//             {children}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modal: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "85%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
// });

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
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText: string;
  children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent
          style={[styles.modal, { paddingBottom: insets.bottom + 10 }]}
        >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={styles.header}>
            <AppText style={styles.title}>{headerText}</AppText>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
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
