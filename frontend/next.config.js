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
      dest: "public",
      runtimeCaching: [
        {
          // MUST be the same as "start_url" in manifest.json
          urlPattern: /\/mytruck$/,
          handler: "CacheFirst",
          options: {
            // don't change cache name
            cacheName: "start-url",
            fetchOptions: {
              credentials: "include"
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          urlPattern: /.js$/,
          handler: "CacheFirst"
        },
        {
          urlPattern: /\/api\/.*$/i,
          handler: "NetworkFirst"
        },
        {
          urlPattern: /.*/i,
          handler: "CacheFirst"
        }
      ]
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
