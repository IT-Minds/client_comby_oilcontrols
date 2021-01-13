/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      disable: process.env.NODE_ENV === "development",
      register: false,
      skipWaiting: false,
      dest: "public"
    }
  })
);
