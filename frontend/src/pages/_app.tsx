import "../styles.global.css";
import "../reactdatepicker.global.css";
import "isomorphic-unfetch";

import { Center, ChakraProvider, CircularProgress, Container, Progress } from "@chakra-ui/react";
import LayoutDesktop from "components/Layout/LayoutDesktop";
import LoginComp from "components/Login/LoginComp";
import RouteProtector from "components/RouteProtector/RouteProtector";
import { ContainerRefContext } from "contexts/ContainerRefContext";
import { UserTypeContext } from "contexts/UserTypeContext";
import { AuthStage, useAuth } from "hooks/useAuth";
import { useLoadProgress } from "hooks/useLoadProgress";
import { usePWA } from "hooks/usePWA";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import Head from "next/head";
import { I18nProvider } from "next-rosetta";
import { ReactElement, useEffect, useRef } from "react";
import EnvSettings from "types/EnvSettings";
import { setEnvSettings } from "utils/envSettings";
import { logger } from "utils/logger";

import theme from "../theme/theme";

type Props = {
  envSettings: EnvSettings;
};

const MyApp = ({ Component, pageProps, __N_SSG, router }: AppPropsType & Props): ReactElement => {
  const progressVal = useLoadProgress(router);

  useEffect(() => {
    if (__N_SSG) {
      logger.info("Page is SSG");
    }
    logger.info("Environment should be readable");

    if (process.browser) {
      fetch("/api/getEnv")
        .then(res => {
          if (res.ok) return res.json();
          throw res.statusText;
        })
        .then(
          envSettings => setEnvSettings(envSettings),
          e => {
            logger.debug("env error", e);
          }
        );
    }
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const auth = useAuth();
  const { authStage, login } = auth;
  usePWA();

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
      <I18nProvider table={pageProps.table}>
        <ChakraProvider theme={theme}>
          {authStage == AuthStage.CHECKING ? (
            <Center>
              <CircularProgress isIndeterminate />
            </Center>
          ) : authStage == AuthStage.UNAUTHENTICATED ? (
            <Container>
              <LoginComp submitCallback={login} />
            </Container>
          ) : (
            <>
              <Progress
                hasStripe
                isAnimated
                size="xs"
                value={progressVal}
                marginBottom={-1}
                zIndex={99}
                hidden={progressVal < 10}
              />
              <UserTypeContext.Provider value={auth}>
                <RouteProtector />
                <ContainerRefContext.Provider value={{ ref }}>
                  <LayoutDesktop ref={ref}>
                    <Component {...pageProps} />
                  </LayoutDesktop>
                </ContainerRefContext.Provider>
              </UserTypeContext.Provider>
            </>
          )}
        </ChakraProvider>
      </I18nProvider>
    </main>
  );
};

export default MyApp;
