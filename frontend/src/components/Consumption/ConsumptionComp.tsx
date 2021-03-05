import "ts-array-ext/sortByAttr";

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack
} from "@chakra-ui/react";
import DatePicker from "components/DatePicker/DatePicker";
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
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 31));
  const [dateLocale, setLocale] = useState<globalThis.Locale>();

  const downloadUsageHistory = useCallback(
    async (type: number) => {
      const client = await genStatsClient();
      const result = await client.getUsageHistoryFile(locationId, type, startDate, endDate);
      downloadFile(result.data, result.fileName);
    },
    [startDate, endDate]
  );

  const getTableData = useCallback(
    async (interval: number) => {
      setInterval(interval);
      const data = await genStatsClient().then(client =>
        client.getUsageHistory(locationId, interval, startDate, endDate)
      );
      setFuelConsumptionEntities(data);
    },
    [startDate, endDate]
  );

  const updateStartDate = useCallback(
    async (newDate: Date) => {
      setStartDate(newDate);
      if (interval != null) {
        const data = await genStatsClient().then(client =>
          client.getUsageHistory(locationId, interval, newDate, endDate)
        );
        setFuelConsumptionEntities(data);
      }
    },
    [endDate, startDate, interval]
  );

  const updateEndDate = useCallback(
    async (newDate: Date) => {
      setEndDate(newDate);
      if (interval != null) {
        const data = await genStatsClient().then(client =>
          client.getUsageHistory(locationId, interval, startDate, newDate)
        );
        setFuelConsumptionEntities(data);
      }
    },
    [startDate, endDate, interval]
  );

  return (
    <Container w="100%" maxW="unset" paddingLeft={0} paddingRight={0} mt={4}>
      <HStack pl={4} alignItems={"end"}>
        <VStack alignItems={"baseline"}>
          {<p>{t("consumptionTable.startDate")}</p>}
          <DatePicker
            locale={dateLocale}
            selectedDate={startDate}
            onChange={(x: Date) => updateStartDate(x)}
            showPopperArrow={false}
          />
        </VStack>

        <VStack alignItems={"baseline"}>
          {<p>{t("consumptionTable.endDate")}</p>}
          <DatePicker
            locale={dateLocale}
            selectedDate={endDate}
            onChange={(x: Date) => updateEndDate(x)}
            showPopperArrow={false}
          />
        </VStack>

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
