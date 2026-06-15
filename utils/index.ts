import AsyncStorage from "@react-native-async-storage/async-storage";
import { RemoteMessage } from "@react-native-firebase/messaging";
import { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";

export type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
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
  text?: string,
  bottomOffset?: number,
) => {
  Toast.show({
    type: type,
    text1: text,
    position: "bottom",
    visibilityTime: type === "loading" ? undefined : 3000,
    autoHide: type !== "loading",
    bottomOffset,
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
  if (!createdAt?._seconds) return "";

  const createdDate = new Date(
    createdAt._seconds * 1000 + createdAt._nanoseconds / 1_000_000,
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
  createdAt: Timestamp,
): string => {
  if (!createdAt?._seconds) return "";

  const createdDate = new Date(
    createdAt._seconds * 1000 + createdAt._nanoseconds / 1_000_000,
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
    createdAt._seconds * 1000 + Math.floor(createdAt._nanoseconds / 1000000),
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

export const breakTextEvery = (text: string, limit: number) => {
  const regex = new RegExp(`(.{1,${limit}})`, "g");
  return text.match(regex)?.join("\n");
};

export const getUserCity = async (): Promise<string | null> => {
  try {
    const locationString = await AsyncStorage.getItem("user_location");
    if (locationString) {
      const location = JSON.parse(locationString);
      return location.city;
    }
    return null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la localisation utilisateur :",
      error,
    );
    return null;
  }
};

export const removeAdFromInfiniteList = (
  queryKey: any[],
  adId: string,
  queryClient: QueryClient,
) => {
  queryClient.setQueryData(queryKey, (oldData: any) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        ads: page.ads.filter((ad: any) => ad.id !== adId),
      })),
    };
  });
};

export const addAdToInfiniteList = (
  queryKey: any[],
  ad: any,
  queryClient: QueryClient,
) => {
  queryClient.setQueryData(queryKey, (oldData: any) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page: any, index: number) => {
        if (index === 0) {
          return {
            ...page,
            ads: [ad, ...page.ads],
          };
        }
        return page;
      }),
    };
  });
};

export const decrementCount = (queryKey: any[], queryClient: QueryClient) => {
  queryClient.setQueryData<number>(queryKey, (old) => {
    if (typeof old !== "number") return old;

    return Math.max(old - 1, 0);
  });
};

export const incrementCount = (queryKey: any[], queryClient: QueryClient) => {
  queryClient.setQueryData<number>(queryKey, (old) => {
    if (typeof old !== "number") return old;

    return old + 1;
  });
};

export const getAdToInfiniteList = (
  queryKey: any[],
  adId: string,
  queryClient: QueryClient,
) => {
  const data = queryClient.getQueryData(queryKey) as any;

  const ad = data?.pages
    .flatMap((page: any) => page.ads)
    .find((ad: any) => ad.id === adId);

  return ad;
};

export const modifyAdToInfiniteList = (
  queryKey: any[],
  modification: any,
  queryClient: QueryClient,
) => {
  queryClient.setQueryData(queryKey, (oldData: any) => {
    if (!oldData) return oldData;

    const newPages = oldData.pages.map((page: any) => ({
      ...page,
      ads: page.ads.map((ad: any) =>
        ad.id === modification.id ? { ...ad, ...modification } : ad,
      ),
    }));

    return {
      ...oldData,
      pages: newPages,
    };
  });
};

export const modifyAdToQueryData = (
  queryKey: any[],
  modification: any,
  queryClient: QueryClient,
) => {
  queryClient.setQueryData(queryKey, (oldData: any) => {
    console.log(JSON.stringify(oldData, null, 2));

    if (!oldData) return oldData;

    return { ...oldData, ...modification };
  });
};

export const filterNotificationsQueryData = (
  queryClient: QueryClient,
  userId: string,
) => {
  queryClient.setQueryData(["notifications"], (oldData: any) => {
    if (!oldData) return oldData;
    return oldData.filter((data: any) => data.userId === userId);
  });
};

export const addNotificationToQueryData = (
  queryClient: QueryClient,
  notification: RemoteMessage,
  userId?: string,
) => {
  queryClient.setQueryData(["notifications"], (oldData: any) => {
    console.log("oldData:", oldData);

    const time = notification.sentTime ?? Date.now();

    const timestamp = {
      _seconds: Math.floor(time / 1000),
      _nanoseconds: (time % 1000) * 1_000_000,
    };

    const newNotification = {
      id: notification.data?.id ?? uuidv4(),
      title: notification.notification?.title ?? "",
      body: notification.notification?.body ?? "",
      type: notification.data?.type,
      userId:
        notification.data?.type === "USER_NOTIFICATION" ? userId : undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return [newNotification, ...(oldData ?? [])];
  });
};

export const getUserToken = async (): Promise<string> => {
  let token = (await AsyncStorage.getItem("algolia_user_token")) as
    | string
    | null;
  if (!token) {
    token = uuidv4();
    await AsyncStorage.setItem("algolia_user_token", token!);
  }
  return token as string;
};
