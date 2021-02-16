import {
  Button,
  Container,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genStatsClient } from "services/backend/apiClients";
import { IntervalRecord } from "services/backend/ext/enumConvertor";
import { FuelConsumptionDto } from "services/backend/nswagts";

type Props = {
  locationId: number;
};

const ConsumptionTableComp: FC<Props> = ({ locationId }) => {
  const { t } = useI18n<Locale>();
  const [interval, setInterval] = useState(null);
  const [fuelConsumptionEntities, setFuelConsumptionEntities] = useState<FuelConsumptionDto[]>(
    null
  );

  const previousYear = new Date();
  previousYear.setFullYear(previousYear.getFullYear() - 1);

  const [data, dataDispatch] = useReducer(
    ListReducer<FuelConsumptionDto>("locationId"),
    fuelConsumptionEntities ?? []
  );

  useEffect(() => {
    if (fuelConsumptionEntities) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: fuelConsumptionEntities
      });
    }
  }, [fuelConsumptionEntities]);

  const getTableData = useCallback(async (interval: number) => {
    setInterval(interval);
    const data = await genStatsClient().then(client =>
      client.getUsageHistory(locationId, interval, previousYear, new Date())
    );
    setFuelConsumptionEntities(data);
  }, []);

  return (
    <Container w="100%" maxW="unset">
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
      <Table variant="striped" colorScheme="blue" size="sm">
        <TableCaption placement="top">{t("consumptionTable.consumptionHistory")}</TableCaption>

        <Thead>
          <Tr>
            <Th>{t("consumptionTable.address")}</Th>
            <Th>{t("consumptionTable.fuelConsumed")}</Th>
            <Th>{t("consumptionTable.startDate")}</Th>
            <Th>{t("consumptionTable.endDate")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(fc => (
            <Tr key={fc.locationId}>
              <Td>{fc.address}</Td>
              <Td>{fc.fuelConsumed}</Td>
              <Td>{fc.startDate}</Td>
              <Td>{fc.endDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default ConsumptionTableComp;
