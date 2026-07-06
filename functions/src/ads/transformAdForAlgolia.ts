import { onCall } from "firebase-functions/v2/https";

export const transformAdForAlgolia = onCall(
  {
    region: "us-central1",
    invoker: "public",
  },
  async (request) => {
    const data = request.data;

    // Gère tous les formats possibles que peut prendre un Timestamp Firestore
    // une fois sérialisé en JSON par l'extension.
    function getTimestampMillis(value: any): number {
      if (!value) return Date.now();
      if (typeof value._seconds === "number") return value._seconds * 1000;
      if (typeof value.seconds === "number") return value.seconds * 1000;
      if (typeof value === "number") return value;
      return Date.now();
    }

    const createdAtMs = getTimestampMillis(data.createdAt);

    return {
      ...data,
      clicks: data.stats?.clicks ?? 0,
      imageNames: (data.images || [])
        .map((url: any) => url.split("/").pop()?.split(".")[0])
        .join(" "),
      optionsText: (data.options || [])
        .filter((opt: any) => opt.active)
        .map((opt: any) => opt.label)
        .join(" "),
      createdAt: createdAtMs,
    };
  },
);
