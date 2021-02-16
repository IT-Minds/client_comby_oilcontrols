import "ts-array-ext/sortByAttr";

import { Button, Container, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { genStatsClient } from "services/backend/apiClients";
import { IntervalRecord } from "services/backend/ext/enumConvertor";
import { downloadFile } from "utils/downloadFile";

import ConsumptionTableComp from "./ConsumptionTableComp";

type Props = {
  locationId: number;
};

const ConsumptionComp: FC<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();
  const previousYear = new Date();
  previousYear.setFullYear(previousYear.getFullYear() - 1);

  const downloadUsageHistory = useCallback(async (type: number) => {
    const client = await genStatsClient();
    const result = await client.getUsageHistoryFile(locationId, type, previousYear, new Date());
    downloadFile(result.data, result.fileName);
  }, []);

  return (
    <Container w="100%" maxW="unset" paddingLeft={0} paddingRight={0}>
      <VStack>
        <ConsumptionTableComp locationId={locationId}></ConsumptionTableComp>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton as={Button} rightIcon={isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}>
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
      </VStack>
    </Container>
  );
};

export default ConsumptionComp;
