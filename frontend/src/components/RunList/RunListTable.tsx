import { HStack, IconButton, Spacer, Table, useBreakpointValue } from "@chakra-ui/react";
import { Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import QuerySortBtn, { Direction } from "components/SortFilter/QuerySortBtn";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useRef, useState } from "react";
import { GiFuelTank } from "react-icons/gi";
import { MdPrint, MdRemoveRedEye } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { genTruckClient } from "services/backend/apiClients";
import { FuelType, ILocationRefillDto, RefillSchedule, TankType } from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";

import data from "./data";

type SelectRowCb = (obj: ILocationRefillDto) => void;

type Props = {
  truckId: number;
  refillCb: SelectRowCb;
};

const defaultSort = (a: ILocationRefillDto, b: ILocationRefillDto) =>
  a.refillId > b.refillId ? 1 : -1;

const RunListTable: FC<Props> = ({ truckId, refillCb }) => {
  const { t } = useI18n<Locale>();

  const [refills, setRefills] = useState<ILocationRefillDto[]>([]);
  const cols = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    xl: 4
  });
  const { locale } = useRouter();

  useEffectAsync(async () => {
    if (process.browser) {
      const client = await genTruckClient();
      client.setCacheableResponse();
      const something = await client.getTrucksRefills(truckId).then(
        x => x ?? [],
        () => data
      );
      setRefills(something);
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

  const [isPrinting, setIsPrinting] = useState(false);
  const componentRef = useRef<HTMLTableElement>();
  const handlePrint = useReactToPrint({
    onBeforeGetContent: () => setIsPrinting(true),
    onBeforePrint: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),

    content: () => componentRef.current
  });

  return (
    <Table variant="simple" ref={componentRef} size="sm" w="100%">
      {/* <TableCaption>{cols}</TableCaption> */}
      <Thead>
        <Tr>
          <Th hidden={!isPrinting && cols < 4}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.bstNumber")}</Text>
              <Spacer />
              {
                //TODO: change to BST number when backend is ready
              }
              <QuerySortBtn queryKey="locationId" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 4}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.comments")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="???" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 4}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.debtorBlocked")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="locationType" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.address")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="address" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 3}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.agreementType")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="schedule" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 2}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.fuelType")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="fuelType" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.deadline")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="expectedDeliveryDate" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th pl="0" hidden={isPrinting}>
            <IconButton
              float="right"
              colorScheme="blue"
              aria-label="Print Table Button"
              size={"sm"}
              onClick={() => {
                setIsPrinting(true);
                handlePrint();
              }}
              icon={<MdPrint />}
            />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {refills.sort(sort).map(row => (
          <Tr key={row.refillId}>
            <Td hidden={!isPrinting && cols < 4}>{row.locationId}</Td>
            <Td hidden={!isPrinting && cols < 4}>DATA MISSING</Td>
            <Td hidden={!isPrinting && cols < 4}>{row.debtorBlocked.toString()}</Td>
            <Td>
              {row.address} {row.addressExtra}
            </Td>
            <Td hidden={!isPrinting && cols < 3}>{capitalize(RefillSchedule[row.schedule])}</Td>
            <Td hidden={!isPrinting && cols < 2}>{capitalize(FuelType[row.fuelType])}</Td>
            <Td>{row.expectedDeliveryDate.toLocaleDateString(locale)}</Td>
            <Td pl="0" hidden={isPrinting}>
              <HStack float="right">
                <IconButton
                  size="sm"
                  colorScheme="orange"
                  aria-label={"do something" + row.refillId}
                  onClick={() => refillCb({ ...row })}
                  icon={<GiFuelTank size={30} />}
                />
                <IconButton
                  size="sm"
                  colorScheme="gray"
                  aria-label={"do something 2" + row.refillId}
                  onClick={() => refillCb(row)}
                  icon={<MdRemoveRedEye size={24} />}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RunListTable;
