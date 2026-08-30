import test from "node:test";
import assert from "node:assert/strict";

import {
  computeHomeScore,
  rankHomeAds,
  rankSimilarAds,
  withBoostSafetyCaps,
} from "./ranking";

test("home boost bonus is meaningful but capped", () => {
  const boosted = {
    id: "boosted-1",
    city: "Ouagadougou",
    category: "Immobilier",
    subCategory: "Appartement",
    price: 300000,
    createdAt: { _seconds: 1_700_000_000, _nanoseconds: 0 },
    boostStatus: "active",
    boostStartAt: { _seconds: 1_700_000_000, _nanoseconds: 0 },
    boostExpiredAt: { _seconds: 1_800_000_000, _nanoseconds: 0 },
    userId: "user-1",
  };

  const organic = {
    id: "organic-1",
    city: "Ouagadougou",
    category: "Immobilier",
    subCategory: "Appartement",
    price: 320000,
    createdAt: { _seconds: 1_700_000_000, _nanoseconds: 0 },
    userId: "user-2",
  };

  const boostedScore = computeHomeScore(boosted, "Ouagadougou", "user-3");
  const organicScore = computeHomeScore(organic, "Ouagadougou", "user-3");

  assert.ok(boostedScore > organicScore, "Boosted ad should gain visibility");
  assert.ok(boostedScore < organicScore + 40, "Boost bonus should remain capped");
});

test("home ranking keeps a cap on boost visibility", () => {
  const ads = Array.from({ length: 6 }, (_, index) => ({
    id: `ad-${index}`,
    city: "Ouagadougou",
    category: "Immobilier",
    subCategory: "Appartement",
    price: 300000 + index * 5000,
    createdAt: { _seconds: 1_700_000_000 + index, _nanoseconds: 0 },
    userId: index % 2 === 0 ? "seller-a" : `seller-${index}`,
    boostStatus: index < 3 ? "active" : undefined,
    boostStartAt: index < 3
      ? { _seconds: 1_700_000_000, _nanoseconds: 0 }
      : undefined,
    boostExpiredAt: index < 3
      ? { _seconds: 1_800_000_000, _nanoseconds: 0 }
      : undefined,
  }));

  const ranked = rankHomeAds(ads, "Ouagadougou", "buyer-1");
  const boostedTop = ranked.filter((ad) => ad.boostStatus === "active").slice(0, 2);

  assert.ok(boostedTop.length <= 2, "At most two boosted ads in the opening window");
  const sellers = boostedTop.map((ad) => ad.userId);
  assert.equal(new Set(sellers).size, sellers.length, "No duplicate seller should dominate the top");
});

test("similar items keep relevance above boosted status", () => {
  const boostedLessRelevant = {
    id: "boosted-low",
    city: "Bobo-Dioulasso",
    category: "Automobile",
    subCategory: "Voiture",
    price: 2500000,
    createdAt: { _seconds: 1_700_000_000, _nanoseconds: 0 },
    boostStatus: "active",
    boostStartAt: { _seconds: 1_700_000_000, _nanoseconds: 0 },
    boostExpiredAt: { _seconds: 1_800_000_000, _nanoseconds: 0 },
    userId: "user-9",
  };

  const organicMoreRelevant = {
    id: "organic-high",
    city: "Ouagadougou",
    category: "Automobile",
    subCategory: "Voiture",
    price: 2300000,
    createdAt: { _seconds: 1_700_000_500, _nanoseconds: 0 },
    userId: "user-10",
  };

  const ranked = rankSimilarAds([boostedLessRelevant, organicMoreRelevant], {
    currentAdId: "current-1",
    category: "Automobile",
    subCategory: "Voiture",
    city: "Ouagadougou",
    price: 2400000,
    userId: "user-99",
    description: "Voiture occasion",
  });

  assert.equal(ranked[0].id, "organic-high", "More relevant ad stays first");
});

test("boost safety cap avoids same-seller saturation", () => {
  const ads = [
    { id: "a1", userId: "seller-z", boostStatus: "active" },
    { id: "a2", userId: "seller-z", boostStatus: "active" },
    { id: "a3", userId: "seller-z", boostStatus: "active" },
    { id: "a4", userId: "seller-y", boostStatus: "active" },
  ] as any[];

  const capped = withBoostSafetyCaps(ads, 2, 2);

  assert.ok(capped.length <= 2, "Safety cap should restrict top boosted ads");
  assert.equal(new Set(capped.map((ad) => ad.userId)).size, 2, "Distinct sellers should remain visible");
});
