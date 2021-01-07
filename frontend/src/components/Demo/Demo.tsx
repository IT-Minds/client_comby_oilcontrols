import {
  Button,
  Container,
  Heading,
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
};

export const PAGE_SHOW_SIZE = 15;

const Demo: FC<Props> = ({ buildTime, preLoadedData = [] }) => {
  const toast = useToast();

  const [data, dataDispatch] = useReducer(ListReducer<ExampleEntityDto>("id"), preLoadedData);
  const [isAddingData, setIsAddingData] = useState(false);
  const [pageShowing, setPageShowing] = useState(0);

  const { done, error, fetchData } = usePagedFetched(
    (x, y, z) => genExampleClient().get(x, y, z),
    dataDispatch
  );

  const pages = useMemo(() => {
    const pageCount = Math.ceil(data.length / PAGE_SHOW_SIZE);
    return [...new Array(pageCount)].map((x, i) => i);
  }, [data]);

  const pageHasMore = useMemo(
    () =>
      !done && pages.length - 1 === pageShowing && (pageShowing + 1) * PAGE_SHOW_SIZE > data.length,
    [done, pages, data, pageShowing]
  );

  const addNewData = useCallback(async () => {
    setIsAddingData(true);
    await genExampleClient().create(
      new CreateExampleEntityCommand({
        exampleEnum: ExampleEnum.A,
        name: Date.now().toString(32)
      })
    );
    await fetchData(data.length);
    setIsAddingData(false);
  }, [data]);

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

          {pageHasMore && (
            <Tr>
              <Td colSpan={3}>
                <Skeleton height="18px" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <PageIndicator activePage={pageShowing} onClickPage={setPageShowing} pages={pages} />

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
