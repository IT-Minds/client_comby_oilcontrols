import {
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
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

  const [fuelConsumptionEntities, setFuelConsumptionEntities] = useState<FuelConsumptionDto[]>(
    null
  );

  const download = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(2000);
    downloadFile(result.data, result.fileName);
  }, []);

  const downloadUsageHistory = useCallback(async (type: number) => {
    const previousYear = new Date();
    previousYear.setFullYear(previousYear.getFullYear() - 1);

    const client = await genStatsClient();
    const result = await client.getUsageHistoryFile(locationId, type, previousYear, new Date());
    downloadFile(result.data, result.fileName);
  }, []);

  const getTableData = useCallback(async (interval: number) => {
    setInterval(interval);
    const data = await genStatsClient().then(client =>
      client.getUsageHistory(locationId, interval, new Date(2020, 1), new Date())
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
          <Button onClick={download}>Download Refill</Button>

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
