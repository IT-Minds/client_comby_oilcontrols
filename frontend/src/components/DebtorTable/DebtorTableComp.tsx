import {
    Container,
    Table,
    TableCaption,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
  } from "@chakra-ui/react";
  import React, { FC, useEffect, useReducer } from "react";
  import ListReducer, { ListReducerActionType } from "react-list-reducer";
  import { DebtorDto } from "services/backend/nswagts";
  
  type Props = {
    preLoadedData?: DebtorDto[];
  };
   
  const DebtorTableComp: FC<Props> = ({
    preLoadedData = []
  }) => {
    const [data, dataDispatch] = useReducer(ListReducer<DebtorDto>("dbId"), preLoadedData ?? []);

      useEffect(() => {
        if (preLoadedData) {
          dataDispatch({
            type: ListReducerActionType.Reset,
            data: preLoadedData
          });
        }
      });
    
    return (
      <Container w="100%" maxW="unset">
        <Table variant="striped" colorScheme="blue" size="sm">
          <TableCaption placement="top">Debtor table</TableCaption>
          <Thead>
            <Tr>
              <Th>Debtor name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(debtor => (
              <Tr key={debtor.dbId}>
                <Td>{debtor.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    );
  };
  
  export default DebtorTableComp;
  