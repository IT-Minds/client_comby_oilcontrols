import {
  Button,
  Container,
  HStack,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import PageIndicator from "components/Demo/components/PageIndicator";
import QuerySingleSelectBtn from "components/SortFilter/QuerySingleSelectBtn";
import { usePagedFetched } from "hooks/usePagedFetched";
import React, { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genRefillClient } from "services/backend/apiClients";
import { LocationRefillDto, TankType } from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";
import { logger } from "utils/logger";

import QueryMultiSelectBtn from "../SortFilter/QueryMultiSelectBtn";
import QuerySortBtn, { Direction } from "../SortFilter/QuerySortBtn";
import styles from "./styles.module.css";

type Props = {
  preLoadedData?: LocationRefillDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
};

export const PAGE_SHOW_SIZE = 15;

const defaultSort = (a: LocationRefillDto, b: LocationRefillDto) =>
  a.refillId > b.refillId ? 1 : -1;

const FillingOverviewComp: FC<Props> = ({
  preLoadedData = [],
  preloadDataNeedle = "0",
  preloadLoadedAll = false
}) => {
  const [data, dataDispatch] = useReducer(
    ListReducer<LocationRefillDto>("refillId"),
    preLoadedData ?? []
  );
  const [pageShowing, setPageShowing] = useState(0);

  const { done } = usePagedFetched(
    "createdAt",
    (needle, size) => genRefillClient().then(client => client.get(needle, size)),
    dataDispatch,
    {
      autoStart: !preloadLoadedAll,
      initialNeedle: preloadDataNeedle,
      pageSize: PAGE_SHOW_SIZE
    }
  );

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  }, [preLoadedData]);

  const pages = useMemo(() => {
    const maxDataLength = data.length;
    const allPageMax = maxDataLength > 0 ? Math.ceil(maxDataLength / PAGE_SHOW_SIZE) : 0;

    return [...new Array(allPageMax)].map((x, i) => i);
  }, [data, done]);

  /**
   * Splits the data into table pages.
   */
  const dataSplitter = useMemo<LocationRefillDto[]>(() => {
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

  const [sort, setSort] = useState<(a: LocationRefillDto, b: LocationRefillDto) => number>(
    () => defaultSort
  );

  const sortCb = useCallback((key: keyof LocationRefillDto, direction: Direction) => {
    if (direction === null) {
      setSort(() => defaultSort);
      return;
    }

    const sortVal = direction === "ASC" ? 1 : -1;
    setSort(() => (a: LocationRefillDto, b: LocationRefillDto) =>
      a[key] > b[key] ? sortVal : -sortVal
    );
  }, []);

  return (
    <Container maxW="4xl">
      <Table variant="simple" colorScheme="white" size="sm" w="100%">
        <Thead>
          <Tr className={styles.slimCol}>
            <Th>
              <HStack spacing={1}>
                <Text>Type</Text>
                <Spacer />
                <QuerySortBtn queryKey="locationType" sortCb={sortCb} />
                <QueryMultiSelectBtn
                  queryKey="locationType"
                  options={[
                    { id: "1", name: "test1" },
                    { id: "2", name: "test2" },
                    { id: "3", name: "test3" }
                  ]}
                  filterCb={(a, b) => logger.debug(a, b)}
                />
              </HStack>
            </Th>
            <Th>
              <HStack spacing={1}>
                <Text>Date</Text>
                <Spacer />
                <QuerySortBtn queryKey="actualDeliveryDate" sortCb={sortCb} />
                <QuerySingleSelectBtn
                  queryKey="actualDeliveryDate"
                  options={[
                    { id: "1", name: "test1" },
                    { id: "2", name: "test2" },
                    { id: "3", name: "test3" }
                  ]}
                />
              </HStack>
            </Th>
            <Th>
              <HStack>
                <Text>Truck ID</Text>
                <Spacer />
                <QuerySortBtn queryKey="truckId" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>
              <HStack>
                <Text>Start</Text>
                <Spacer />
                <QuerySortBtn queryKey="startAmount" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>
              <HStack>
                <Text>End</Text>
                <Spacer />
                <QuerySortBtn queryKey="endAmount" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>Coupon</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataSplitter.sort(sort).map(data => {
            return (
              <Tr key={data.refillId}>
                <Td>{capitalize(TankType[data.locationType])}</Td>
                <Td>{new Date(data.expectedDeliveryDate).toLocaleDateString()}</Td>
                <Td>{data.regionId}</Td>
                <Td isNumeric>{data.locationId}</Td>
                <Td isNumeric>{data.schedule}</Td>
                <Td>{data.debtorBlocked}</Td>
              </Tr>
            );
          })}
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

export default FillingOverviewComp;
