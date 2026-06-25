const IS_DEV = process.env.APP_ENV === "development";

module.exports = ({ config }) => ({
  ...config,
  name: IS_DEV ? "LeCoinBiz (Dev)" : "LeCoinBiz",
  android: {
    ...config.android,
    package: IS_DEV
      ? "com.appolinaire_sdg.LeCoinBiz.dev"
      : "com.appolinaire_sdg.LeCoinBiz",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: IS_DEV
      ? "com.appolinaire-sdg.LeCoinBiz.dev"
      : "com.appolinaire-sdg.LeCoinBiz",
  },
});
