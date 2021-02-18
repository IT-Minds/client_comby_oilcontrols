import { Button, Center, Heading, HStack, Select, Text, VStack } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";
import React, { useCallback, useMemo, useState } from "react";
import { MdArchive } from "react-icons/md";
import { genStatsClient } from "services/backend/apiClients";
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

const LocalePage: NextPage = () => {
  const { t } = useI18n<Locale>();

  const [refillYear, setRefillYear] = useState(null);

  const refillYears = useMemo(() => {
    const refillYears: number[] = [];
    for (let i = new Date().getFullYear() - 15; i <= new Date().getFullYear() + 1; i++) {
      refillYears.push(i);
    }
    return refillYears;
  }, []);

  const downloadRefill = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(refillYear);
    downloadFile(result.data, result.fileName);
  }, [refillYear]);

  return (
    <VStack>
      <Heading textAlign="center" mb={4}>
        {t("localePage.title")}
      </Heading>
      <Text> {t("localePage.infoText")}</Text>
      <HStack mt={4}>
        <Select
          onChange={e => setRefillYear([Number(e.target.value)])}
          placeholder="Select refill year">
          {refillYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="green"
          disabled={!refillYear || refillYear == 0}
          onClick={downloadRefill}
          rightIcon={<MdArchive />}
          pr={6}
          pl={6}>
          {t("localePage.download")}
        </Button>
      </HStack>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table } };
};

export default LocalePage;
