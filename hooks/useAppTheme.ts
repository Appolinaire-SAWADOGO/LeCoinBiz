import { generateDesignSystem } from "@/functions";
import { useThemeStore } from "@/store/useThemeStore";

export const useAppTheme = () => {
  const { primary, setPrimary } = useThemeStore();
  const designSystem = generateDesignSystem(primary);

  return {
    setPrimary,
    designSystem,
  };
};
