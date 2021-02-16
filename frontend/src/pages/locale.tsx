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
import { useEffectAsync } from "hooks/useEffectAsync";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import React, { useCallback, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { genStatsClient } from "services/backend/apiClients";
import { FuelConsumptionDto } from "services/backend/nswagts";
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

type Props = {
  locationId: number;
};

const LocalePage: NextPage<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();

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
                  {t("localePage.tableInterval")}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => getTableData(0)}>{t("localePage.month")}</MenuItem>
                  <MenuItem onClick={() => getTableData(1)}>{t("localePage.quarter")}</MenuItem>
                  <MenuItem onClick={() => getTableData(2)}>{t("localePage.year")}</MenuItem>
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
                  <MenuItem onClick={() => downloadUsageHistory(0)}>
                    {t("localePage.month")}
                  </MenuItem>
                  <MenuItem onClick={() => downloadUsageHistory(1)}>
                    {t("localePage.quarter")}
                  </MenuItem>
                  <MenuItem onClick={() => downloadUsageHistory(2)}>
                    {t("localePage.year")}
                  </MenuItem>
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
