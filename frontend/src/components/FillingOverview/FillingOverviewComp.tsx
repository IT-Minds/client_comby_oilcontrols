import { Button, Container } from "@chakra-ui/react";
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PageIndicator from "components/Demo/components/PageIndicator";
import { usePagedFetched } from "hooks/usePagedFetched";
import React, { FC, useMemo, useReducer, useState } from "react";
import ListReducer from "react-list-reducer";
import { genRefillClient } from "services/backend/apiClients";
import { RefillDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: RefillDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
};

export const PAGE_SHOW_SIZE = 15;

const FillingOverviewComp: FC<Props> = ({
  preLoadedData = [],
  preloadDataNeedle = "0",
  preloadLoadedAll = false,
  preLoadedPageCount = 1
}) => {
  const [data, dataDispatch] = useReducer(ListReducer<RefillDto>("id"), preLoadedData);
  const [pageShowing, setPageShowing] = useState(0);

  const { done, error, fetchData, needle } = usePagedFetched(
    "createdAt",
    (needle, size, sortBy, skip) => genRefillClient().get(), //TODO: missing params
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
  const dataSplitter = useMemo(() => {
    const maxDataLength = data.length;
    const realPageMax = data.length > 0 ? Math.ceil(data.length / PAGE_SHOW_SIZE) : 0;
    const allPageMax = maxDataLength > 0 ? Math.ceil(maxDataLength / PAGE_SHOW_SIZE) : 0;

    if (allPageMax === 0) {
      return {
        data: []
      };
    }

    const realDataOnCurrentPage = data.slice(
      pageShowing * PAGE_SHOW_SIZE,
      (pageShowing + 1) * PAGE_SHOW_SIZE
    );

    if (realDataOnCurrentPage.length >= PAGE_SHOW_SIZE) {
      return {
        data: realDataOnCurrentPage
      };
    }

    if (realDataOnCurrentPage.length > 0) {
      const fillCount = realPageMax * PAGE_SHOW_SIZE - data.length;
      console.assert(
        fillCount === PAGE_SHOW_SIZE - realDataOnCurrentPage.length,
        "Math is not right"
      );

      return {
        data: realDataOnCurrentPage
      };
    }

    return {
      data: []
    };
  }, [data, pageShowing]);

  const elementsOnLastPage = useMemo(() => {
    const elements = data.slice((pages.length - 1) * PAGE_SHOW_SIZE, pages.length * PAGE_SHOW_SIZE);
    return elements.length;
  }, [pages, data]);

  return (
    <Container>
      <Table variant="striped" colorScheme="teal">
        <TableCaption placement="top">Filling overview</TableCaption>
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Date</Th>
            <Th>Truck ID</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Coupon image</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataSplitter.data.map(data => {
            return (
              <Tr key={data.id}>
                <Td>{capitalize(TankType[data.locationType])}</Td>
                <Td>{new Date(data.actualDeliveryDate).toLocaleDateString()}</Td>
                <Td>{data.truckId}</Td>
                <Td>{data.startAmount}</Td>
                <Td>{data.endAmount}</Td>
                <Td>{data.couponId}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <PageIndicator activePage={pageShowing} onClickPage={setPageShowing} pages={pages}>
        {!done && elementsOnLastPage >= PAGE_SHOW_SIZE && (
          <Button colorScheme="blue" size="sm" variant="outline"></Button>
        )}
      </PageIndicator>
    </Container>
  );
};

export default FillingOverviewComp;
