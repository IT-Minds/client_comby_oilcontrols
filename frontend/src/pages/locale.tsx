import { Button, Container, Flex, Heading, HStack, Select } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import React, { useCallback, useState } from "react";
import { genStatsClient } from "services/backend/apiClients";
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

const LocalePage: NextPage = () => {
  const { t } = useI18n<Locale>();

  const [refillYear, setRefillYear] = useState(null);

  const refillYears: number[] = [];
  for (let i = new Date().getFullYear() - 15; i < new Date().getFullYear() + 1; i++) {
    refillYears.push(i);
  }

  const previousYear = new Date();
  previousYear.setFullYear(previousYear.getFullYear() - 1);

  const downloadRefill = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(refillYear);
    downloadFile(result.data, result.fileName);
  }, [refillYear]);

  return (
    <main>
      <Head>
        <title>Oil Control</title>
      </Head>
      <Container maxW="8xl" centerContent>
        <Heading textAlign="center" mb={4}>
          {t("localePage.title")}
        </Heading>
        <HStack>
          <Select
            onChange={e => setRefillYear([Number(e.target.value)])}
            placeholder="Select refill year">
            {refillYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Button disabled={!refillYear || refillYear == 0} onClick={downloadRefill}>
            {t("localePage.downloadRefillHistory")}
          </Button>
        </HStack>
      </Container>
    </main>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table } };
};

export default LocalePage;
