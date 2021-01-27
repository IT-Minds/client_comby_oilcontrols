import { Button, Container, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PageIndicator from "components/Demo/components/PageIndicator";
import { usePagedFetched } from "hooks/usePagedFetched";
import React, { FC, useCallback, useMemo, useReducer, useState } from "react";
import ListReducer from "react-list-reducer";
import { genTruckClient } from "services/backend/apiClients";
import { ITruckInfoIdDto, TruckInfoIdDto } from "services/backend/nswagts";

import styles from "./styles.module.css";

type Props = {
  preLoadedData?: TruckInfoIdDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
  truckId: (id: number) => void;
};

export const PAGE_SHOW_SIZE = 15;

const TruckListComp: FC<Props> = ({
  preLoadedData = [],
  preloadDataNeedle = "0",
  preloadLoadedAll = false,
  truckId
}) => {
  const selectTruck = useCallback((id: number) => {
    truckId(id);
  }, []);
  const [data, dataDispatch] = useReducer(ListReducer<ITruckInfoIdDto>("id"), preLoadedData);
  const [pageShowing, setPageShowing] = useState(0);

  const { done, error, fetchData, needle } = usePagedFetched(
    "createdAt",
    (needle, size, _sortBy, skip) => null,
    //TODO: wrong promise type??
    //genTruckClient().then(client => client.getTrucks(needle, size, skip)),
    dataDispatch,
    {
      autoStart: !preloadLoadedAll,
      initialNeedle: preloadDataNeedle,
      pageSize: PAGE_SHOW_SIZE
    }
  );

  const pages = useMemo(() => {
    const maxDataLength = data.length;
    const allPageMax = maxDataLength > 0 ? Math.ceil(maxDataLength / PAGE_SHOW_SIZE) : 0;

    return [...new Array(allPageMax)].map((x, i) => i);
  }, [data, done]);

  /**
   * Splits the data into table pages.
   */
  const dataSplitter = useMemo<ITruckInfoIdDto[]>(() => {
    const realPageMax = data.length > 0 ? Math.ceil(data.length / PAGE_SHOW_SIZE) : 0;

    if (realPageMax === 0) {
      return [];
    }

    const realDataOnCurrentPage = data.slice(
      pageShowing * PAGE_SHOW_SIZE,
      (pageShowing + 1) * PAGE_SHOW_SIZE
    );
    return realDataOnCurrentPage;
  }, [data, pageShowing]);

  const elementsOnLastPage = useMemo(() => {
    const elements = data.slice((pages.length - 1) * PAGE_SHOW_SIZE, pages.length * PAGE_SHOW_SIZE);
    return elements.length;
  }, [pages, data]);

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
          {dataSplitter.map((data, index) => (
            //TODO: insert real id and remove index
            <Tr key={data.id} onClick={() => truckId(index)}>
              <Td>{data.name}</Td>
              <Td>{data.description}</Td>
              {/* <Td>{data.id}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {pages.length > 1 && (
        <PageIndicator activePage={pageShowing} onClickPage={setPageShowing} pages={pages}>
          {!done && elementsOnLastPage >= PAGE_SHOW_SIZE && (
            <Button colorScheme="blue" size="sm" variant="outline"></Button>
          )}
        </PageIndicator>
      )}
    </Container>
  );
};

export default TruckListComp;
