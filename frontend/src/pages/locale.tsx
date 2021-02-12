import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import ConsumptionTableComp from "components/Consumption/ConsumptionTableComp";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import React, { useCallback } from "react";
import { genStatsClient } from "services/backend/apiClients";
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

type Props = {
  //
};

const LocalePage: NextPage<Props> = () => {
  const { t } = useI18n<Locale>();

  const download = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(2000);
    downloadFile(result.data, result.fileName);
  }, []);

  const downloadUsageHistory = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getUsageHistoryFile();
    downloadFile(result.data, result.fileName);
  }, []);

  return (
    <main>
      <Head>
        <title>Oil Control - landing page</title>
      </Head>
      <Flex>
        <Container maxW="xl" centerContent>
          <Heading>{t("title")}</Heading>
          <Text fontSize="xl">Just some info text</Text>
          <Button onClick={download}>Download Refill</Button>
          <ConsumptionTableComp></ConsumptionTableComp>
          <Button onClick={downloadUsageHistory}>Download Usage History</Button>
        </Container>
      </Flex>
    </main>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table } };
};

export default LocalePage;
