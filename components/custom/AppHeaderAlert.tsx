import React from "react";
import { Alert, AlertText } from "../ui/alert";
import { Button, ButtonText } from "../ui/button";
import { CloseIcon, Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";

export default function AppHeaderAlert() {
  return (
    <Alert className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center bg-red-400">
      <VStack className="gap-4 min-[400px]:flex-row justify-between flex-1 min-[400px]:items-center">
        <AlertText className="font-semibold text-typography-900" size="sm">
          Verify your phone number to create an API key
        </AlertText>
        <Button size="sm" className="hidden sm:flex">
          <ButtonText>Start verification</ButtonText>
        </Button>
      </VStack>
      <Icon as={CloseIcon} />
    </Alert>
  );
}
