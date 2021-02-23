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
import { usePagedFetched } from "hooks/usePagedFetched";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genRefillClient } from "services/backend/apiClients";
import { RefillDto, TankType } from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";

import QuerySortBtn, { Direction } from "../SortFilter/QuerySortBtn";
import styles from "./styles.module.css";

type Props = {
  preLoadedData?: RefillDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
};

export const PAGE_SHOW_SIZE = 15;

const defaultSort = (a: RefillDto, b: RefillDto) =>
  a.actualDeliveryDate > b.actualDeliveryDate ? 1 : -1;

const FillingOverviewComp: FC<Props> = ({
  preLoadedData = [],
  preloadDataNeedle = "0",
  preloadLoadedAll = false
}) => {
  const { t } = useI18n<Locale>();

  const [data, dataDispatch] = useReducer(ListReducer<RefillDto>("refillId"), preLoadedData ?? []);
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
  const dataSplitter = useMemo<RefillDto[]>(() => {
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

  const [sort, setSort] = useState<(a: RefillDto, b: RefillDto) => number>(() => defaultSort);

  const sortCb = useCallback((key: keyof RefillDto, direction: Direction) => {
    if (direction === null) {
      setSort(() => defaultSort);
      return;
    }

    const sortVal = direction === "ASC" ? 1 : -1;
    setSort(() => (a: RefillDto, b: RefillDto) => (a[key] > b[key] ? sortVal : -sortVal));
  }, []);

  return (
    <Container maxW="4xl">
      <Table variant="simple" colorScheme="white" size="sm" w="100%">
        <Thead>
          <Tr className={styles.slimCol}>
            <Th>
              <HStack spacing={1}>
                <Text>{t("fillingOverview.type")}</Text>
                <Spacer />
                <QuerySortBtn queryKey="locationType" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>
              <HStack spacing={1}>
                <Text>{t("fillingOverview.date")}</Text>
                <Spacer />
                <QuerySortBtn queryKey="actualDeliveryDate" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>
              <HStack>
                <Text>{t("fillingOverview.start")}</Text>
                <Spacer />
                <QuerySortBtn queryKey="startAmount" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>
              <Text>{t("fillingOverview.amount")}</Text>
            </Th>
            <Th>
              <HStack>
                <Text>{t("fillingOverview.end")}</Text>
                <Spacer />
                <QuerySortBtn queryKey="endAmount" sortCb={sortCb} />
              </HStack>
            </Th>
            <Th>{t("fillingOverview.coupon")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataSplitter.sort(sort).map(data => {
            return (
              <Tr key={data.id}>
                <Td>{capitalize(TankType[data.locationType])}</Td>
                <Td>{new Date(data.expectedDeliveryDate).toLocaleDateString()}</Td>
                <Td>{data.startAmount}</Td>
                <Td>{data.endAmount}</Td>
                <Td>{data.startAmount - data.endAmount}</Td>
                <Td>{data.couponId}</Td>
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
