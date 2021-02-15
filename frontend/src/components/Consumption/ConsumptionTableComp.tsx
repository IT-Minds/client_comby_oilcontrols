import { Container, Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import React, { FC, useEffect, useReducer } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { FuelConsumptionDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: FuelConsumptionDto[];
};

export const PAGE_SHOW_SIZE = 15;

const ConsumptionTableComp: FC<Props> = ({ preLoadedData = [] }) => {
  const { t } = useI18n<Locale>();

  const [data, dataDispatch] = useReducer(
    ListReducer<FuelConsumptionDto>("locationId"),
    preLoadedData ?? []
  );

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  }, [preLoadedData]);

  return (
    <Container w="100%" maxW="unset">
      <Table variant="striped" colorScheme="blue" size="sm">
        <TableCaption placement="top">{t("refillHistoryTable.refillHistory")}</TableCaption>
        <Thead></Thead>
        <Tbody>
          <Tr>
            <Td>Address</Td>
            <Td>Fuel Consumed</Td>
            <Td>Start Date</Td>
            <Td>End Date</Td>
          </Tr>
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
