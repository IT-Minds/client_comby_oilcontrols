import { Container, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { TruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: TruckInfoIdDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
  truckId: (id: number) => void;
};

export const PAGE_SHOW_SIZE = 15;

const TruckListComp: FC<Props> = ({ preLoadedData = [], truckId }) => {
  const [data, dataDispatch] = useReducer(ListReducer<TruckInfoIdDto>("id"), preLoadedData ?? []);

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  });

  return (
    <Container maxW="4xl">
      <Table size="sm" data-testid="data" data-value={data.length}>
        <Thead>
          <Tr>
            <Th>Truck name</Th>
            <Th>Truck description</Th>
            <Th>Id</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(data => (
            <Tr key={data.id} _hover={{ cursor: "pointer" }} onClick={() => truckId(data.id)}>
              <Td>{data.name}</Td>
              <Td>{data.description}</Td>
              <Td>{data.id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default TruckListComp;
