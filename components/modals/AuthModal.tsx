import AuthSignInWithEmail from "@/components/auth/to-identify/AuthSignInWithEmail";
import AuthSignUpWithEmail from "@/components/auth/to-identify/AuthSignUpWithEmail";
import ToIdentifyIndex from "@/components/auth/to-identify/ToIdentifyIndex";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { AuthModalStepType } from "@/types";
import React, { useEffect } from "react";
import AuthContinousWithPhoneNumber from "../auth/to-identify/AuthContinousWithPhoneNumber";
import AppFullModal from "./AppFullModal";

export default function AuthModal() {
  const [step, setStep] = React.useState<AuthModalStepType>("Index");

  const { isOpen, onClose } = useAuthModalStore();

  useEffect(() => {
    setStep("Index");
  }, [isOpen]);

  return (
    <AppFullModal isOpen={isOpen} onClose={onClose}>
      {step === "Index" && <ToIdentifyIndex setStep={setStep} />}
      {step === "continousWithPhoneNumber" && (
        <AuthContinousWithPhoneNumber setBigStep={setStep} />
      )}
      {step === "signInWithEmail" && (
        <AuthSignInWithEmail setBigStep={setStep} />
      )}
      {step === "signUpWithEmail" && (
        <AuthSignUpWithEmail setBigStep={setStep} />
      )}
    </AppFullModal>
  );
}
