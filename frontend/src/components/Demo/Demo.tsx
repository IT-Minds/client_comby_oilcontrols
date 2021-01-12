import {
  Button,
  Container,
  Heading,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from "@chakra-ui/react";
import { useOffline } from "hooks/useOffline";
import { usePagedFetched } from "hooks/usePagedFetched";
import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genExampleClient } from "services/backend/apiClients";
import {
  CreateExampleEntityCommand,
  ExampleEntityDto,
  ExampleEnum
} from "services/backend/nswagts";
import { EmptyIdEntity } from "types/EmptyIdEntity";

import ExampleTableRow from "./components/ExampleTableRow";
import PageIndicator from "./components/PageIndicator";
import styles from "./styles.module.css";

type Props = {
  buildTime: number;
  preLoadedData?: ExampleEntityDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
};

export const PAGE_SHOW_SIZE = 15;

const Demo: FC<Props> = ({
  buildTime,
  preLoadedData = [],
  preloadDataNeedle = "0",
  preloadLoadedAll = false,
  preLoadedPageCount = 1
}) => {
  const toast = useToast();

  const [data, dataDispatch] = useReducer(ListReducer<ExampleEntityDto>("id"), preLoadedData);
  const [ghostData, ghostDataDispatch] = useReducer(ListReducer<EmptyIdEntity>("id"), []);
  const [pageShowing, setPageShowing] = useState(0);

  const { awaitCallback, isOnline } = useOffline();

  const { done, error, fetchData, needle } = usePagedFetched(
    "createdAt",
    (needle, size, sortBy, skip) => genExampleClient().get(needle, size, sortBy, skip),
    // genExampleClient().get,
    dataDispatch,
    {
      autoStart: !preloadLoadedAll,
      initialNeedle: preloadDataNeedle,
      pageSize: PAGE_SHOW_SIZE
    }
  );

  const pages = useMemo(() => {
    const maxDataLength = data.length + ghostData.length;
    const allPageMax = maxDataLength > 0 ? Math.ceil(maxDataLength / PAGE_SHOW_SIZE) : 0;

    return [...new Array(allPageMax)].map((x, i) => i);
  }, [data, done, ghostData]);

  /**
   * Splits the data into table pages.
   */
  const dataSplitter = useMemo(() => {
    const maxDataLength = data.length + ghostData.length;
    const realPageMax = data.length > 0 ? Math.ceil(data.length / PAGE_SHOW_SIZE) : 0;
    const allPageMax = maxDataLength > 0 ? Math.ceil(maxDataLength / PAGE_SHOW_SIZE) : 0;
    const ghostPages = allPageMax - realPageMax;

    if (allPageMax === 0) {
      return {
        data: [],
        ghosts: []
      };
    }

    const realDataOnCurrentPage = data.slice(
      pageShowing * PAGE_SHOW_SIZE,
      (pageShowing + 1) * PAGE_SHOW_SIZE
    );

    if (realDataOnCurrentPage.length >= PAGE_SHOW_SIZE) {
      return {
        data: realDataOnCurrentPage,
        ghosts: []
      };
    }

    if (realDataOnCurrentPage.length > 0 || ghostPages === 0) {
      const fillCount = realPageMax * PAGE_SHOW_SIZE - data.length;
      console.assert(
        fillCount === PAGE_SHOW_SIZE - realDataOnCurrentPage.length,
        "Math is not right"
      );
      const ghosts = ghostData.slice(0, fillCount);

      return {
        data: realDataOnCurrentPage,
        ghosts
      };
    }

    const startIndex =
      (pageShowing - realPageMax) * PAGE_SHOW_SIZE + (realPageMax * PAGE_SHOW_SIZE - data.length);
    // const fillCount = realPageMax * PAGE_SHOW_SIZE - data.length;

    const ghosts = ghostData.slice(startIndex, startIndex + PAGE_SHOW_SIZE);
    return {
      data: [],
      ghosts
    };
  }, [data, ghostData, pageShowing]);

  const addNewData = useCallback(async () => {
    const name = Date.now().toString(32);
    ghostDataDispatch({
      type: ListReducerActionType.Add,
      data: {
        id: name
      }
    });
    awaitCallback(
      () =>
        genExampleClient()
          .create(
            new CreateExampleEntityCommand({
              exampleEnum: ExampleEnum.A,
              name
            })
          )
          .then(
            x => {
              ghostDataDispatch({
                type: ListReducerActionType.Remove,
                data: name
              });
            },
            x => {
              ghostDataDispatch({
                type: ListReducerActionType.Remove,
                data: name
              });
            }
          ),
      name
    );
  }, [data, needle]);

  useEffect(() => {
    if (ghostData.length === 0) {
      fetchData();
    }
  }, [ghostData]);

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
    <Container centerContent padding="2">
      <Heading className={styles.title} data-testid="buildTime" data-value={buildTime}>
        Pagination table example
      </Heading>

      <Text colorScheme={isOnline ? "green" : "red"}>{isOnline ? "Online" : "Offline"}</Text>

      {/* <Image
        src="/images/icons/icon-512x512.png"
        alt="Picture of the author"
        width={300}
        height={300}
        quality={90}
      /> */}

      <Table size="sm" data-testid="data" data-value={data.length}>
        <Thead>
          <Tr>
            <Th isNumeric>ID</Th>
            <Th>Name</Th>
            <Th>Enum</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataSplitter.data.map(dat => (
            <ExampleTableRow key={dat.id} rowData={dat} />
          ))}

          {dataSplitter.ghosts.map(ghost => (
            <Tr key={ghost.id}>
              <Td colSpan={3}>
                <Skeleton height="18px" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PageIndicator activePage={pageShowing} onClickPage={setPageShowing} pages={pages}>
        {!done && elementsOnLastPage >= PAGE_SHOW_SIZE && (
          <Button colorScheme="blue" size="sm" variant="outline"></Button>
        )}
      </PageIndicator>

      <Button data-testid="addNewBtn" onClick={addNewData} colorScheme="purple" variant="solid">
        Add new data element
      </Button>
    </Container>
  );
};

export default Demo;
