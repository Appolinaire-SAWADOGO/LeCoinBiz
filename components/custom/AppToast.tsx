// import { Button, ButtonText } from "@/components/ui/button";
// import { Divider } from "@/components/ui/divider";
// import { Icon } from "@/components/ui/icon";
// import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
// import { Send } from "lucide-react-native";

// export default function AppToast({
//   isOpen,
//   setOpen,
// }: {
//   isOpen: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   const toast = useToast();
//   return (
//     <Button
//       onPress={() => {
//         toast.show({
//           placement: "top",
//           render: ({ id }) => {
//             const toastId = "toast-" + id;
//             return (
//               <Toast
//                 nativeID={toastId}
//                 className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
//               >
//                 <Icon
//                   as={Send}
//                   size="xl"
//                   className="fill-typography-100 stroke-none"
//                 />
//                 <Divider
//                   orientation="vertical"
//                   className="h-[30px] bg-outline-200"
//                 />
//                 <ToastTitle size="sm">Message sent successfully</ToastTitle>
//               </Toast>
//             );
//           },
//         });
//       }}
//     >
//       <ButtonText>Show Toast</ButtonText>
//     </Button>
//   );
// }
