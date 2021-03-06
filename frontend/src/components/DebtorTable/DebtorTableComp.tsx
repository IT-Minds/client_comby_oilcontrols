import { Container, Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { DebtorTableContext } from "contexts/DebtorTableContext";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useEffect, useReducer } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { DebtorDto } from "services/backend/nswagts";

import DebtorDetailsTriggerBtn from "./DebtorDetailsTriggerBtn";

type Props = {
  preLoadedData?: DebtorDto[];
};

const DebtorTableComp: FC<Props> = ({ preLoadedData = [] }) => {
  const { t } = useI18n<Locale>();

  const [data, dataDispatch] = useReducer(ListReducer<DebtorDto>("id"), preLoadedData ?? []);

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  }, [preLoadedData]);

  const debtorUpdated = useCallback((debtor: DebtorDto) => {
    dataDispatch({
      type: ListReducerActionType.Update,
      data: debtor
    });
  }, []);

  return (
    <Container w="100%" maxW="unset">
      <Table variant="striped" colorScheme="blue" size="sm">
        <TableCaption placement="top">{t("debtorTable.debtorTable")}</TableCaption>
        <Thead>
          <Tr>
            <Th>{t("debtorTable.debtorName")}</Th>
            <Th>{t("debtorTable.debtorId")}</Th>
            <Th>{t("debtorTable.unicontaId")}</Th>
          </Tr>
        </Thead>

        <DebtorTableContext.Provider
          value={{
            debtorUpdated
          }}>
          <Tbody>
            {data.map(debtor => (
              <Tr key={debtor.id}>
                <Td>{debtor.name}</Td>
                <Td>{debtor.id}</Td>
                <Td>{debtor.unicontaId}</Td>
                <Td>
                  <DebtorDetailsTriggerBtn debtorData={debtor} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </DebtorTableContext.Provider>
      </Table>
    </Container>
  );
};

export default DebtorTableComp;
