import { HStack, Spacer, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import RefillModalBtn from "components/FillOutRefillForm/RefillModalBtn";
import EditLocationTriggerBtn from "components/LocaleMetaDataForm/EditLocationTriggerBtn";
import ViewLocationHistoryModalBtn from "components/LocationHistory/ViewLocationHistoryModalBtn";
import OrderRefillComp from "components/OrderRefill/OrderRefillComp";
import QuerySortBtn, { Direction } from "components/SortFilter/QuerySortBtn";
import { useColors } from "hooks/useColors";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useState } from "react";
import { genRefillClient } from "services/backend/apiClients";
import {
  IOrderRefillCommand,
  LocationDetailsIdDto,
  OrderRefillCommand,
  RefillSchedule
} from "services/backend/nswagts";

type Props = {
  data: LocationDetailsIdDto[];
};

const LocationList: FC<Props> = ({ data }) => {
  const { t } = useI18n<Locale>();

  const { hoverBg } = useColors();

  const orderRefill = useCallback(async (orderRefillForm: IOrderRefillCommand) => {
    const client = await genRefillClient();
    await client.orderRefill(new OrderRefillCommand(orderRefillForm));
  }, []);

  const defaultSort = (a: LocationDetailsIdDto, b: LocationDetailsIdDto) => (a.id > b.id ? 1 : -1);

  const [sort, setSort] = useState<(a: LocationDetailsIdDto, b: LocationDetailsIdDto) => number>(
    () => defaultSort
  );

  const sortCb = useCallback((key: keyof LocationDetailsIdDto, direction: Direction) => {
    if (direction === null) {
      setSort(() => defaultSort);
      return;
    }

    const sortVal = direction === "ASC" ? 1 : -1;
    setSort(() => (a: LocationDetailsIdDto, b: LocationDetailsIdDto) =>
      a[key] > b[key] ? sortVal : -sortVal
    );
  }, []);

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>
            <HStack spacing={1}>
              <Text>{t("locationList.address")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="address" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("locationList.regionId")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="regionId" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("locationList.scheduleType")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="scheduleType" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.sort(sort).map(dat => (
          <Tr
            key={dat.id}
            _hover={{
              bg: hoverBg
            }}>
            <Td>
              {dat.address} {dat.addressExtra}
            </Td>
            <Td>{dat.regionId}</Td>
            <Td>{RefillSchedule[dat.schedule]}</Td>
            <Td>
              <HStack>
                <EditLocationTriggerBtn data={dat} />

                <ViewLocationHistoryModalBtn data={dat} />

                <OrderRefillComp locationId={dat.id} submitCallback={orderRefill} />

                <RefillModalBtn />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default LocationList;
