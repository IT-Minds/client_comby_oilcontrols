/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");

let withBundleAnalyzer = x => x;
try {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
  });
} catch {
  //
}

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      disable: process.env.NODE_ENV === "development",
      register: false,
      skipWaiting: false,
      dest: "public"
    },
    i18n: {
      locales: ["en-US", "kl-GL", "da-DK"],
      defaultLocale: "en-US"
    }
  })
);
