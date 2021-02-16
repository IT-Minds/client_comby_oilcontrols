import {
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  VStack
} from "@chakra-ui/react";
import ConsumptionTableComp from "components/Consumption/ConsumptionTableComp";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import React, { useCallback, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { genStatsClient } from "services/backend/apiClients";
import { IntervalRecord } from "services/backend/ext/enumConvertor";
import { FuelConsumptionDto } from "services/backend/nswagts";
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

type Props = {
  locationId: number;
};

const LocalePage: NextPage<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();

  const [interval, setInterval] = useState(null);
  const [refillYear, setRefillYear] = useState(null);

  const refillYears: number[] = [];
  for (let i = new Date().getFullYear() - 15; i < new Date().getFullYear() + 1; i++) {
    refillYears.push(i);
  }

  const previousYear = new Date();
  previousYear.setFullYear(previousYear.getFullYear() - 1);

  const [fuelConsumptionEntities, setFuelConsumptionEntities] = useState<FuelConsumptionDto[]>(
    null
  );

  const downloadRefill = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(refillYear);
    downloadFile(result.data, result.fileName);
  }, [refillYear]);

  const downloadUsageHistory = useCallback(async (type: number) => {
    const client = await genStatsClient();
    const result = await client.getUsageHistoryFile(locationId, type, previousYear, new Date());
    downloadFile(result.data, result.fileName);
  }, []);

  const getTableData = useCallback(async (interval: number) => {
    setInterval(interval);
    const data = await genStatsClient().then(client =>
      client.getUsageHistory(locationId, interval, previousYear, new Date())
    );
    setFuelConsumptionEntities(data);
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

          <VStack>
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
          </VStack>

          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rightIcon={isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}>
                  {interval != null
                    ? t("enums.interval." + interval)
                    : t("localePage.tableInterval")}
                </MenuButton>
                <MenuList>
                  {Object.entries(IntervalRecord).map(([a, b]) => (
                    <MenuItem key={b} onClick={() => getTableData(b)}>
                      {t("enums.interval." + b)}
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>
          <ConsumptionTableComp preLoadedData={fuelConsumptionEntities}></ConsumptionTableComp>

          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rightIcon={isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}>
                  {t("localePage.downloadHistory")}
                </MenuButton>

                <MenuList>
                  {Object.entries(IntervalRecord).map(([a, b]) => (
                    <MenuItem key={b} onClick={() => downloadUsageHistory(b)}>
                      {t("enums.interval." + b)}
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>
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
