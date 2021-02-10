import { Container, Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { DebtorTableContext } from "contexts/DebtorTableContext";
import React, { FC, useCallback, useEffect, useReducer } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { DebtorDto } from "services/backend/nswagts";

import DebtorDetailsTriggerBtn from "./DebtorDetailsTriggerBtn";

type Props = {
  preLoadedData?: DebtorDto[];
};

const DebtorTableComp: FC<Props> = ({ preLoadedData = [] }) => {
  const [data, dataDispatch] = useReducer(ListReducer<DebtorDto>("dbId"), preLoadedData ?? []);

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  });

  const debtorUpdated = useCallback((debtor: DebtorDto) => {
    dataDispatch({
      type: ListReducerActionType.Update,
      data: debtor
    });
  }, []);

  return (
    <Container w="100%" maxW="unset">
      <Table variant="striped" colorScheme="blue" size="sm">
        <TableCaption placement="top">Debtor table</TableCaption>
        {
            //TODO: translation
        }
        <Thead>
          <Tr>
            <Th>Debtor name</Th>
            <Th>Debtor ID</Th>
            <Th>Uniconta ID</Th>
          </Tr>
        </Thead>

        <DebtorTableContext.Provider
          value={{
            debtorUpdated
          }}>
          <Tbody>
            {data.map(debtor => (
              <Tr key={debtor.dbId}>
                <Td>{debtor.name}</Td>
                <Td>{debtor.dbId}</Td>
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
