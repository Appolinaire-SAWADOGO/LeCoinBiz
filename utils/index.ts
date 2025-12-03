import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

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

export const showToast = (
  type: "success" | "error" | "loading",
  text?: string
) => {
  Toast.show({
    type: type,
    text1: text,
    position: "bottom",
    visibilityTime: type === "loading" ? undefined : 3000,
    autoHide: type !== "loading",
  });
};

export async function addRecentSearch(newSearch: string) {
  try {
    const stored = await AsyncStorage.getItem("recents_searchs");
    let recents: string[] = stored ? JSON.parse(stored) : [];

    recents = recents.filter((item) => item !== newSearch);

    recents.unshift(newSearch);

    if (recents.length > 8) recents = recents.slice(0, 8);

    await AsyncStorage.setItem("recents_searchs", JSON.stringify(recents));

    console.log("Recherche ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
  }
}

export const getTimeSinceCreated = (createdAt: Timestamp): string => {
  if (!createdAt?.seconds) return "";

  const createdDate = new Date(
    createdAt.seconds * 1000 + createdAt.nanoseconds / 1_000_000
  );
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Publié à l'instant";
  if (minutes < 60) return `Publié il y a ${minutes} min`;
  if (hours < 24) return `Publié il y a ${hours} h`;
  if (days < 7) return `Publié il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (weeks < 5) return `Publié il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  if (months < 12) return `Publié il y a ${months} mois`;
  return `Publié il y a ${years} an${years > 1 ? "s" : ""}`;
};

export const getUserAccountTimeSinceCreated = (
  createdAt: Timestamp
): string => {
  if (!createdAt?.seconds) return "";

  const createdDate = new Date(
    createdAt.seconds * 1000 + createdAt.nanoseconds / 1_000_000
  );
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Membre depuis l'instant";
  if (minutes < 60) return `Membre depuis ${minutes} min`;
  if (hours < 24) return `Membre depuis ${hours} h`;
  if (days < 7) return `Membre depuis ${days} jour${days > 1 ? "s" : ""}`;
  if (weeks < 5) return `Membre depuis ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  if (months < 12) return `Membre depuis ${months} mois`;
  return `Membre depuis ${years} an${years > 1 ? "s" : ""}`;
};

export const getTimeSinceMs = (createdAtMs: number): string => {
  if (!createdAtMs) return "";

  const createdDate = new Date(createdAtMs);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Publié à l'instant";
  if (minutes < 60) return `Publié il y a ${minutes} min`;
  if (hours < 24) return `Publié il y a ${hours} h`;
  if (days < 7) return `Publié il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (weeks < 5) return `Publié il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  if (months < 12) return `Publié il y a ${months} mois`;
  return `Publié il y a ${years} an${years > 1 ? "s" : ""}`;
};

export const formatCreatedAt = (createdAt: Timestamp): string => {
  if (!createdAt) return "";

  const date = new Date(
    createdAt.seconds * 1000 + Math.floor(createdAt.nanoseconds / 1000000)
  );

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const hookResponse = (success: boolean, message: string) => ({
  success,
  message,
});
