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
import { downloadFile } from "utils/downloadFile";

import { Locale } from "../i18n/Locale";

type Props = {
  locationId: number;
};

const LocalePage: NextPage<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const download = useCallback(async () => {
    const client = await genStatsClient();
    const result = await client.getRefillOfYearFile(2000);
    downloadFile(result.data, result.fileName);
  }, []);

  const downloadUsageHistory = useCallback(async (type: number) => {
    const client = await genStatsClient();
    const result = await client.getUsageHistoryFile(
      locationId,
      type,
      new Date(2020, 1),
      new Date()
    );
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

          <Menu
            onOpen={() => {
              setIsOpen(true);
            }}
            onClose={() => {
              setIsOpen(false);
            }}>
            <MenuButton as={Button} rightIcon={isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}>
              Download History
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => downloadUsageHistory(0)}>Måned</MenuItem>
              <MenuItem onClick={() => downloadUsageHistory(1)}>Kvartal</MenuItem>
              <MenuItem onClick={() => downloadUsageHistory(2)}>År</MenuItem>
            </MenuList>
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
