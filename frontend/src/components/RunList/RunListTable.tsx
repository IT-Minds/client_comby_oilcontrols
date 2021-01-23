import {
  forwardRef,
  HStack,
  IconButton,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import QuerySortBtn, { Direction } from "components/SortFilter/QuerySortBtn";
import { ForwardRefRenderFunction, useCallback, useEffect, useState } from "react";
import { GiFuelTank } from "react-icons/gi";
import { genTruckClient } from "services/backend/apiClients";
import { ILocationRefillDto, RefillSchedule } from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";

type Props = {
  truckId: number;
};

const defaultSort = (a: ILocationRefillDto, b: ILocationRefillDto) =>
  a.refillId > b.refillId ? 1 : -1;

// TODO i18n;
const RunListTable: ForwardRefRenderFunction<HTMLTableElement, Props> = ({ truckId }, ref) => {
  const [refills, setRefills] = useState<ILocationRefillDto[]>([]);
  useEffect(() => {
    if (process.browser) {
      (async () => {
        const client = await genTruckClient();
        client.setCacheableResponse("NetworkFirst");
        const something = await client.getTrucksRefills(truckId);
        setRefills(something);
      })();
    }
  }, [truckId]);

  const [sort, setSort] = useState<(a: ILocationRefillDto, b: ILocationRefillDto) => number>(
    () => defaultSort
  );

  const sortCb = useCallback((key: keyof ILocationRefillDto, direction: Direction) => {
    if (direction === null) {
      setSort(() => defaultSort);
      return;
    }

    const sortVal = direction === "ASC" ? 1 : -1;
    setSort(() => (a: ILocationRefillDto, b: ILocationRefillDto) =>
      a[key] > b[key] ? sortVal : -sortVal
    );
  }, []);

  return (
    <Table variant="simple" ref={ref}>
      {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
      <Thead>
        <Tr>
          {/* <Th>Location Type</Th> */}
          <Th>
            <HStack spacing={1}>
              <Text>Address</Text>
              <Spacer />
              <QuerySortBtn queryKey="address" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>Agreement Type</Text>
              <Spacer />
              <QuerySortBtn queryKey="schedule" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>Deadline</Text>
              <Spacer />
              <QuerySortBtn queryKey="expectedDeliveryDate" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {refills.sort(sort).map(row => (
          <Tr key={row.refillId}>
            {/* <Td>{capitalize(TankType[row.locationType])}</Td> */}
            <Td>{row.address}</Td>
            <Td>{capitalize(RefillSchedule[row.schedule])}</Td>
            <Td>{row.expectedDeliveryDate.toLocaleDateString()}</Td>
            <Td>
              <IconButton
                size="sm"
                colorScheme="orange"
                aria-label="do something"
                icon={<GiFuelTank size={30} />}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default forwardRef(RunListTable);
