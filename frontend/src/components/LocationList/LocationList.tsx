import "ts-array-ext/distinct";

import { HStack, Spacer, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import RefillModalBtn from "components/FillOutRefillForm/RefillModalBtn";
import EditLocationTriggerBtn from "components/LocaleMetaDataForm/EditLocationTriggerBtn";
import ViewLocationHistoryModalBtn from "components/LocationHistory/ViewLocationHistoryModalBtn";
import OrderRefillComp from "components/OrderRefill/OrderRefillComp";
import QuerySingleSelectBtn from "components/SortFilter/QuerySingleSelectBtn";
import QuerySortBtn, { Direction } from "components/SortFilter/QuerySortBtn";
import { useColors } from "hooks/useColors";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { genRefillClient } from "services/backend/apiClients";
import {
  ILocationDetailsIdDto,
  IOrderRefillCommand,
  LocationDetailsIdDto,
  OrderRefillCommand,
  RefillSchedule
} from "services/backend/nswagts";
import DropdownType from "types/DropdownType";

type Props = {
  data: LocationDetailsIdDto[];
};

const LocationList: FC<Props> = ({ data }) => {
  const { locale } = useRouter();
  const { t } = useI18n<Locale>();

  const { hoverBg } = useColors();

  const [origData, setOrigData] = useState<LocationDetailsIdDto[]>([]);
  const [filteredData, setFilteredData] = useState<LocationDetailsIdDto[]>([]);

  const orderRefill = useCallback(async (orderRefillForm: IOrderRefillCommand) => {
    const client = await genRefillClient();
    await client.orderRefill(new OrderRefillCommand(orderRefillForm));
  }, []);

  useEffect(() => {
    setOrigData(data);
    setFilteredData(data);
  }, [data]);

  //Sorting
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

  //Filtering
  const uniqueStreets = useMemo(() => {
    const streets = data.distinct(l => l.address).map(l => l.address);
    return streets;
  }, [data]);

  const uniqueSchedules = useMemo(() => {
    const schedules = data.distinct(l => l.schedule).map(l => l.schedule);
    return schedules;
  }, [data]);

  const filterCb = useCallback(
    (qkey: keyof ILocationDetailsIdDto, chosenOptions: DropdownType["id"]) => {
      const filtered = origData.filter(d => d[qkey] == chosenOptions);
      filtered.length > 0 ? setFilteredData(filtered) : setFilteredData(origData);
    },
    [origData]
  );

  const dateTimeFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale);
  }, [locale]);

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>
            <HStack spacing={1}>
              <Text>{t("locationList.address")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="address" sortCb={sortCb} />
              <QuerySingleSelectBtn
                queryKey="address"
                filterCb={filterCb}
                options={uniqueStreets.map(s => ({
                  id: s,
                  name: s
                }))}
              />
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
              <Text>DEBUG</Text>
              <Spacer />
              <QuerySortBtn queryKey="predictedFuelDate" sortCb={sortCb} />
            </HStack>
          </Th>
          <Th>
            <HStack spacing={1}>
              <Text>{t("locationList.scheduleType")}</Text>
              <Spacer />
              <QuerySortBtn queryKey="scheduleType" sortCb={sortCb} />
              <QuerySingleSelectBtn
                queryKey="schedule"
                filterCb={filterCb}
                options={uniqueSchedules.map(s => ({
                  id: s,
                  name: t("enums.refillSchedule." + s) + ""
                }))}
              />
            </HStack>
          </Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {filteredData.sort(sort).map(dat => (
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
            <Td>{dateTimeFormatter.format(dat.predictedFuelDate)}</Td>
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
