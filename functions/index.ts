export function getTimeBasedGreeting(): string {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const generateDesignSystem = (primary: string) => ({
  colors: {
    // #2e8b57
    // #641BB4
    primary,
    primaryLight: hexToRgba(primary, 0.1),
    secondary: "#23334A",
    primaryDisabled: "#B28DDA",
    secondaryDisabled: "#7B8592",
    infoCard: "#EEEFF1",
    inputBorder: "#E5E5E5",
    bigText: "#1B2431",
    smallText: "#23334A",
    subText: "#777777",
    completed: "#0D8536",
    icon: "#23334A",
    inputBackground: "#F5F5F5",
  },
  buttonBorderRadius: 50,
  fontFamily: "BasisGrotesqueArabicPro-Regular",
});
