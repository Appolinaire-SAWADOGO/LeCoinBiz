type TimestampLike =
  | { _seconds?: number; seconds?: number; _nanoseconds?: number }
  | undefined
  | null;

type SimpleAd = {
  id?: string;
  userId?: string;
  city?: string;
  category?: string;
  subCategory?: string;
  price?: number;
  createdAt?: TimestampLike;
  boostStatus?: string;
  boostStartAt?: TimestampLike;
  boostExpiredAt?: TimestampLike;
  stats?: { clicks?: number };
  description?: string;
  title?: string;
  options?: Array<{ label?: string; active?: boolean }>;
};

const getTimestampMs = (value?: TimestampLike): number => {
  if (!value) return 0;
  if (typeof (value as any)._seconds === "number")
    return (value as any)._seconds * 1000;
  if (typeof (value as any).seconds === "number")
    return (value as any).seconds * 1000;
  return 0;
};

const normalizeText = (value?: string): string =>
  (value ?? "").toLowerCase().trim();

const scoreBoostValue = (ad: SimpleAd): number => {
  if (ad.boostStatus !== "active") return 0;

  const now = Date.now();
  const start = getTimestampMs(ad.boostStartAt);
  const end = getTimestampMs(ad.boostExpiredAt);

  if (!start || !end) return 10;

  const totalWindow = Math.max(1, end - start);
  const remaining = Math.max(1, end - now);
  const ratio = remaining / totalWindow;

  return Math.max(5, Math.round(18 * ratio + 7));
};

export const computeHomeScore = (
  ad: SimpleAd,
  userCity?: string,
  currentUserId?: string,
): number => {
  let score = 0;

  if (userCity && ad.city === userCity) score += 35;
  if (ad.category) score += 10;
  if (ad.subCategory) score += 8;

  if (typeof ad.price === "number") {
    score += 6;
  }

  const createdAtMs = getTimestampMs(ad.createdAt);
  if (createdAtMs) {
    const ageHours = (Date.now() - createdAtMs) / 3600000;
    const freshnessBonus = Math.max(0, 15 - ageHours / 24);
    score += freshnessBonus;
  }

  score += (ad.stats?.clicks ?? 0) * 0.01;

  if (currentUserId && ad.userId === currentUserId) score -= 40;

  score += scoreBoostValue(ad);

  return score;
};

export const withBoostSafetyCaps = <
  T extends { id?: string; userId?: string; boostStatus?: string },
>(
  ads: T[],
  maxBoostedInTopN = 2,
  maxPerSeller = 1,
): T[] => {
  if (!ads.length) return ads;

  const selectedBoosted: T[] = [];
  const sellerCounts = new Map<string, number>();

  for (const ad of ads) {
    if (ad.boostStatus !== "active") continue;
    if (selectedBoosted.length >= maxBoostedInTopN) break;

    const seller = ad.userId || "unknown";
    const sellerCount = sellerCounts.get(seller) ?? 0;

    if (sellerCount < maxPerSeller) {
      selectedBoosted.push(ad);
      sellerCounts.set(seller, sellerCount + 1);
    }
  }

  const selectedIds = new Set(
    selectedBoosted.map(
      (ad) => ad.id ?? `${ad.userId ?? "unknown"}-${Math.random()}`,
    ),
  );

  const remaining = ads.filter(
    (ad) =>
      !selectedIds.has(ad.id ?? `${ad.userId ?? "unknown"}-${Math.random()}`),
  );

  return [...selectedBoosted, ...remaining];
};

export const prioritizeBoostedAds = <
  T extends { id?: string; userId?: string; boostStatus?: string },
>(
  ads: T[],
  maxBoostedInTopN = 2,
  maxPerSeller = 1,
): T[] => {
  return withBoostSafetyCaps(ads, maxBoostedInTopN, maxPerSeller);
};

export const rankHomeAds = <T extends SimpleAd>(
  ads: T[],
  userCity?: string,
  currentUserId?: string,
): T[] => {
  const scored = ads
    .map((ad) => ({
      ad,
      score: computeHomeScore(ad, userCity, currentUserId),
    }))
    .sort((a, b) => b.score - a.score);

  const filtered = scored.map(({ ad }) => ad);
  const safetyCapped = withBoostSafetyCaps(filtered, 2, 1);

  return safetyCapped.sort((a, b) => {
    const scoreA = computeHomeScore(a, userCity, currentUserId);
    const scoreB = computeHomeScore(b, userCity, currentUserId);
    return scoreB - scoreA;
  });
};

export const rankSimilarAds = <T extends SimpleAd>(
  ads: T[],
  params: {
    currentAdId?: string;
    category?: string;
    subCategory?: string;
    city?: string;
    price?: number;
    description?: string;
    userId?: string;
  },
): T[] => {
  const scored = ads
    .map((ad) => {
      let score = 0;

      if (params.category && ad.category === params.category) score += 28;
      if (params.subCategory && ad.subCategory === params.subCategory)
        score += 40;
      if (params.city && ad.city === params.city) score += 18;
      if (typeof params.price === "number" && typeof ad.price === "number") {
        const diff =
          Math.abs(ad.price - params.price) / Math.max(params.price, 1);
        if (diff < 0.2) score += 18;
        else if (diff < 0.5) score += 8;
      }

      const titleText = normalizeText(ad.title);
      const descText = normalizeText(ad.description ?? "");
      const queryText = normalizeText(params.description ?? "");
      if (
        queryText &&
        (titleText.includes(queryText) || descText.includes(queryText))
      ) {
        score += 16;
      }

      if (params.userId && ad.userId === params.userId) score -= 50;
      if (params.currentAdId && ad.id === params.currentAdId) score -= 100;

      const boostBonus = scoreBoostValue(ad) * 0.6;
      score += boostBonus;

      return { ad, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.map(({ ad }) => ad).slice(0, 10);
};
