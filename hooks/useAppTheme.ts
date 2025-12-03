import { useThemeStore } from "@/store/useThemeStore";
import { generateDesignSystem } from "@/utils";

export const useAppTheme = () => {
  const { primary, setPrimary } = useThemeStore();
  const designSystem = generateDesignSystem(primary);

  return {
    setPrimary,
    designSystem,
  };
};
