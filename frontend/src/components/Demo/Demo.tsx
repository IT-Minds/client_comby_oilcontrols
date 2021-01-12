import {
  Button,
  Container,
  Heading,
  Progress,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from "@chakra-ui/react";
import { usePagedFetched } from "hooks/usePagedFetched";
import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ListReducer from "react-list-reducer";
import { genExampleClient } from "services/backend/apiClients";
import {
  CreateExampleEntityCommand,
  ExampleEntityDto,
  ExampleEnum
} from "services/backend/nswagts";

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
  const [isAddingData, setIsAddingData] = useState(false);
  const [pageShowing, setPageShowing] = useState(0);

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
    const pageCount = Math.ceil(data.length / PAGE_SHOW_SIZE);

    return [...new Array(pageCount)].map((x, i) => i);
  }, [data, done]);

  const pageHasMore = useCallback(
    pageNo =>
      (!done || isAddingData) &&
      pages.length - 1 === pageNo &&
      (pageNo + 1) * PAGE_SHOW_SIZE > data.length,
    [done, pages, data, isAddingData]
  );

  const addNewData = useCallback(async () => {
    setIsAddingData(true);
    await genExampleClient().create(
      new CreateExampleEntityCommand({
        exampleEnum: ExampleEnum.A,
        name: Date.now().toString(32)
      })
    );
    await fetchData(needle);
    setIsAddingData(false);
  }, [data, needle]);

  const elementsOnLastPage = useMemo(() => {
    const elements = data.slice((pages.length - 1) * PAGE_SHOW_SIZE, pages.length * PAGE_SHOW_SIZE);
    return elements.length;
  }, [pages, pageHasMore, data]);

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

      <Progress hasStripe isAnimated value={(pages.length / preLoadedPageCount) * 100} size="sm" />

      <Image
        src="/images/icons/icon-512x512.png"
        alt="Picture of the author"
        width={300}
        height={300}
        quality={90}
      />

      <Table size="sm" data-testid="data" data-value={data.length}>
        <Thead>
          <Tr>
            <Th isNumeric>ID</Th>
            <Th>Name</Th>
            <Th>Enum</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.slice(pageShowing * PAGE_SHOW_SIZE, (pageShowing + 1) * PAGE_SHOW_SIZE).map(dat => (
            <ExampleTableRow key={dat.id} rowData={dat} />
          ))}

          {pageHasMore(pageShowing) && (
            <Tr>
              <Td colSpan={3}>
                <Skeleton height="18px" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <PageIndicator activePage={pageShowing} onClickPage={setPageShowing} pages={pages}>
        {!done && elementsOnLastPage >= PAGE_SHOW_SIZE && (
          <Button colorScheme="blue" size="sm" variant="outline" isLoading={true}></Button>
        )}
      </PageIndicator>

      <Button
        data-testid="addNewBtn"
        onClick={addNewData}
        colorScheme="purple"
        variant="solid"
        isLoading={isAddingData}>
        Add new data element
      </Button>
    </Container>
  );
};

export default Demo;
