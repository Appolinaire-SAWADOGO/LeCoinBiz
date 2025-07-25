import ContinousWithGoogle from "@/components/auth/to-identify/ContinousWithGoogle";
import ContinousWithPhoneNumber from "@/components/auth/to-identify/ContinousWithPhoneNumber";
import SignInWithEmail from "@/components/auth/to-identify/SignInWithEmail";
import SignUpWithEmail from "@/components/auth/to-identify/SignUpWithEmail";
import ToIdentifyIndex from "@/components/auth/to-identify/ToIdentifyIndex";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AuthModalType } from "@/types";
import React from "react";
import AppFullModal from "../modals/AppFullModal";

export default function AuthModal() {
  const [step, setStep] = React.useState<AuthModalType>("Index");

  const { isOpen, onClose } = useAuthModalStore();

  return (
    <AppFullModal isOpen={isOpen} onClose={onClose}>
      {step === "Index" && <ToIdentifyIndex setStep={setStep} />}
      {step === "continousWithPhoneNumber" && (
        <ContinousWithPhoneNumber setBigStep={setStep} />
      )}
      {step === "signInWithEmail" && <SignInWithEmail setBigStep={setStep} />}
      {step === "signUpWithEmail" && <SignUpWithEmail setBigStep={setStep} />}
      {step === "continousWithGoogle" && <ContinousWithGoogle />}
    </AppFullModal>
  );
}
