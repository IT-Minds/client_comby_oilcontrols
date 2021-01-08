import "../styles.global.css";
import "isomorphic-unfetch";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { usePWA } from "hooks/usePWA";
import { AppContextType, AppPropsType } from "next/dist/next-server/lib/utils";
import Head from "next/head";
import { ReactElement, useEffect } from "react";
import EnvSettings from "types/EnvSettings";
import isomorphicEnvSettings, { setEnvSettings } from "utils/envSettings";
import { logger } from "utils/logger";

type Props = {
  envSettings: EnvSettings;
};

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac"
  }
};
const theme = extendTheme({ colors });

const MyApp = ({
  Component,
  pageProps,
  envSettings,
  __N_SSG,
  router
}: AppPropsType & Props): ReactElement => {
  usePWA();

  useEffect(() => {
    if (!__N_SSG || __N_SSG === undefined) {
      logger.info("Environment should be readable");
      setEnvSettings(envSettings);
    }

    // router.events.on("routeChangeStart", () => NProgress.start());
    // router.events.on("routeChangeComplete", () => NProgress.done());
    // router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <main>
      <Head>
        <title>Oil Controls</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2196f3" />
        <meta name="description" content="Oil Controls" />
        <meta name="robots" content="noindex" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png"></link>
      </Head>
      <noscript>
        <h1>JavaScript must be enabled!</h1>
      </noscript>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </main>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContextType) => {
  let pageProps: Record<string, unknown> = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const envSettings = isomorphicEnvSettings();

  return { pageProps, envSettings };
};

export default MyApp;
