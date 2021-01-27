import {
  Button,
  Container,
  Table,
  TableCaption,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast
} from "@chakra-ui/react";
import PageIndicator from "components/Demo/components/PageIndicator";
import { useOffline } from "hooks/useOffline";
import { usePagedFetched } from "hooks/usePagedFetched";
import React, { FC, useEffect, useMemo, useReducer, useState } from "react";
import ListReducer from "react-list-reducer";
import { genLocationHistoryClient } from "services/backend/apiClients";
import { ILocationHistoryDto, LocationHistoryDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: LocationHistoryDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
  locationId: number;
};

export const PAGE_SHOW_SIZE = 15;

const LocationHistoryComp: FC<Props> = ({
  preLoadedData = [],
  preloadDataNeedle = "",
  preloadLoadedAll = false,
  locationId = 1
}) => {
  const toast = useToast();

  const [data, dataDispatch] = useReducer(
    ListReducer<ILocationHistoryDto>("locationId"),
    preLoadedData
  );
  const [pageShowing, setPageShowing] = useState(0);

  const { awaitCallback, isOnline } = useOffline();

  const { done, error, fetchData, needle } = usePagedFetched(
    "0",
    (needle, size, _sortBy, skip) =>
      genLocationHistoryClient().then(client =>
        client.getLocationHistory(locationId, new Date(needle), size, skip)
      ),
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

  useEffect(() => {
    if (done)
      toast({
        title: "All data loaded",
        description:
          "All the pages for the table is now loaded and the skeleton should not be visible",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    if (error)
      toast({
        title: "Error during data fetch!",
        description: "An error occurred during fetch of all page data",
        status: "error",
        duration: 5000,
        isClosable: true
      });
  }, [done, error]);

  return (
    <Container>
      <Table variant="striped" colorScheme="teal">
        <TableCaption placement="top">Location History</TableCaption>
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Comments</Th>
            <Th>Region ID</Th>
            <Th>Schedule</Th>
            <Th>Time of change</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataSplitter.data.map(lh => (
            <tr key={lh.id}>
              <td>{lh.address}</td>
              <td>{lh.comments}</td>
              <td>{lh.regionId}</td>
              <td>{lh.schedule}</td>
              <td>{lh.timeOfChange}</td>
            </tr>
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

export default LocationHistoryComp;
