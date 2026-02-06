import { Switch } from "@/components/ui/switch";
import { useAppTheme } from "@/hooks/useAppTheme";
import colors from "tailwindcss/colors";

export default function AppSwitch({
  onValueChange,
  value = false,
}: {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
}) {
  const { designSystem } = useAppTheme();
  return (
    <Switch
      size="md"
      onValueChange={() => {
        onValueChange?.(true);
      }}
      value={value}
      trackColor={{
        false: colors.neutral[300],
        true: designSystem.colors.primary,
      }}
      thumbColor={colors.neutral[50]}
      ios_backgroundColor={colors.neutral[300]}
    />
  );
}
