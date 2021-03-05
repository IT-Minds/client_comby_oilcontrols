import { HStack, IconButton, Spacer, Table, useBreakpointValue } from "@chakra-ui/react";
import { Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import RefillModalBtn from "components/FillOutRefillForm/RefillModalBtn";
import LocationImageModal from "components/ImageModal/LocationImageModal";
import QuerySortBtn, { Direction } from "components/SortFilter/QuerySortBtn";
import { TruckContext } from "contexts/TruckContext";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { ILocationRefillDto, RefillSchedule } from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";

const defaultSort = (a: ILocationRefillDto, b: ILocationRefillDto) =>
  a.refillId > b.refillId ? 1 : -1;

const RunListTable: FC = () => {
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();

  const cols = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    xl: 4
  });

  const { refills, truck } = useContext(TruckContext);

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
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="bstNumber"
                sortCb={sortCb}
              />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 4}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.comments")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="comments"
                sortCb={sortCb}
              />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 4}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.debtorBlocked")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="locationType"
                sortCb={sortCb}
              />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.address")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="address"
                sortCb={sortCb}
                defaultVal="ASC"
              />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 3}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.agreementType")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="schedule"
                sortCb={sortCb}
              />
            </HStack>
          </Th>
          <Th hidden={!isPrinting && cols < 2}>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.fuelType")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="fuelType"
                sortCb={sortCb}
              />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("mytruck.runlist.deadline")}</Text>
              <Spacer />
              <QuerySortBtn
                queryGroup={"truckrefill" + truck.id}
                queryKey="expectedDeliveryDate"
                sortCb={sortCb}
              />
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
            <Td hidden={!isPrinting && cols < 4}>{row.bstNumber}</Td>
            <Td hidden={!isPrinting && cols < 4}>{row.comments}</Td>
            <Td hidden={!isPrinting && cols < 4}>{row.debtorBlocked.toString()}</Td>
            <Td>
              {row.address} {row.addressExtra}
            </Td>
            <Td hidden={!isPrinting && cols < 3}>{t("enums.refillSchedule." + row.schedule)}</Td>
            <Td hidden={!isPrinting && cols < 2}>{t("enums.fuelType." + row.fuelType)}</Td>
            <Td>{row.expectedDeliveryDate.toLocaleDateString(locale)}</Td>
            <Td pl="0" hidden={isPrinting}>
              <HStack float="right">
                <RefillModalBtn refill={row} />
                <LocationImageModal location={row} />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RunListTable;
