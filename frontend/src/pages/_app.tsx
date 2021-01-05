import "../styles.global.css";
import "isomorphic-unfetch";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SignalRContext } from "contexts/SignalRContext";
import { usePWA } from "hooks/usePWA";
import { AppContextType, AppPropsType } from "next/dist/next-server/lib/utils";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import EnvSettings from "types/EnvSettings";
import isomorphicEnvSettings, { setEnvSettings } from "utils/envSettings";
import { logger } from "utils/logger";

type Props = {
  envSettings: EnvSettings;
};

const MyApp = ({ Component, pageProps, envSettings }: AppPropsType & Props): ReactElement => {
  const [connection, setConnection] = useState<HubConnection>(null);

  usePWA();

  useEffect(() => {
    setEnvSettings(envSettings);

    if (process.browser) {
      const connection = new HubConnectionBuilder()
        .withUrl(envSettings.backendUrl + "/signalr/chat")
        .build();

      connection.start().then(
        () => setConnection(connection),
        err => {
          logger.warn("SignalR not connecting:", err);
        }
      );
    }
  }, []);

  return (
    <main>
      <Head>
        <title>APPNAMEHERE</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2196f3" />
        <meta name="description" content="APPNAMEHERE" />
        <meta name="robots" content="noindex" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png"></link>
      </Head>
      <noscript>
        <h1>JavaScript must be enabled!</h1>
      </noscript>
      <SignalRContext.Provider value={{ connection }}>
        <Component {...pageProps} />
      </SignalRContext.Provider>
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
