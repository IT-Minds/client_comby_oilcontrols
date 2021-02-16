import "ts-array-ext/sortByAttr";

import { Button, Container, HStack, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { genStatsClient } from "services/backend/apiClients";
import { IntervalRecord } from "services/backend/ext/enumConvertor";
import { FuelConsumptionDto } from "services/backend/nswagts";
import { downloadFile } from "utils/downloadFile";

import ConsumptionTableComp from "./ConsumptionTableComp";

type Props = {
  locationId: number;
};

const ConsumptionComp: FC<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();

  const [interval, setInterval] = useState(null);
  const [fuelConsumptionEntities, setFuelConsumptionEntities] = useState<FuelConsumptionDto[]>(
    null
  );

  const previousYear = new Date();
  previousYear.setFullYear(previousYear.getFullYear() - 1);

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
    <Container w="100%" maxW="unset" paddingLeft={0} paddingRight={0} mt={4}>
      <HStack pl={4}>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton as={Button} rightIcon={isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}>
                {interval != null ? t("enums.interval." + interval) : t("localePage.tableInterval")}
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
      </HStack>
      <ConsumptionTableComp preLoadedData={fuelConsumptionEntities}></ConsumptionTableComp>
    </Container>
  );
};

export default ConsumptionComp;
