/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");
const { join } = require("path");
const { readdirSync } = require("fs");

const startPath = join(process.cwd(), "src", "i18n");

// const locales = readdirSync(startPath)
//   .filter(x => !/^Locale\.ts$/.test(x))
//   .map(x => {
//     return /^([a-z]{2}-[A-Z]{2})\.ts$/.exec(x)[1];
//   });

const locales = ["da-DK"];

const defaultLocale = "da-DK";

if (!locales.includes(defaultLocale)) {
  throw Error("Default Locale not part of other locales: " + locales.join(","));
}

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
      skipWaiting: true,
      dest: "public"
    },
    i18n: {
      locales,
      defaultLocale
    },
    env: {
      locales
    }
  })
);
