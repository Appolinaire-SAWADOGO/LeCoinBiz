const IS_DEV = process.env.APP_ENV === "development";

module.exports = ({ config }) => ({
  ...config,
  name: IS_DEV ? "LeCoinBiz (Dev)" : "LeCoinBiz",
  android: {
    ...config.android,
    package: IS_DEV
      ? "com.appolinaire_sdg.LeCoinBiz.dev"
      : "com.appolinaire_sdg.LeCoinBiz",
    config: {
      googleMaps: {
        apiKey: "AIzaSyABhaH_Jh3cM8etiD0eeMsLx0ACVcNyf0U",
      },
    },
  },
  ios: {
    ...config.ios,
    bundleIdentifier: IS_DEV
      ? "com.appolinaire-sdg.LeCoinBiz.dev"
      : "com.appolinaire-sdg.LeCoinBiz",
    config: {
      googleMapsApiKey: "AIzaSyABhaH_Jh3cM8etiD0eeMsLx0ACVcNyf0U",
    },
  },
});
