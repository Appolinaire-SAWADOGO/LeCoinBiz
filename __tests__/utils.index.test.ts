import { extractCityFromPlaceDetails } from "../utils";

describe("extractCityFromPlaceDetails", () => {
  it("returns the locality from Google place details", () => {
    const details = {
      address_components: [
        {
          long_name: "Ouagadougou",
          short_name: "OUA",
          types: ["locality", "political"],
        },
        {
          long_name: "Kadiogo",
          short_name: "KDG",
          types: ["administrative_area_level_1", "political"],
        },
      ],
    };

    expect(extractCityFromPlaceDetails(details as any)).toBe("Ouagadougou");
  });

  it("returns undefined when no locality is present", () => {
    const details = {
      address_components: [
        {
          long_name: "Burkina Faso",
          short_name: "BF",
          types: ["country", "political"],
        },
      ],
    };

    expect(extractCityFromPlaceDetails(details as any)).toBeUndefined();
  });
});
