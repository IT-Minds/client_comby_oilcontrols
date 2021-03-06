import { IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useColors } from "hooks/useColors";
import { useI18n } from "next-rosetta";
import React, { FC, useEffect, useReducer } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { TruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: TruckInfoIdDto[];
  preloadDataNeedle?: string;
  preloadLoadedAll?: boolean;
  preLoadedPageCount?: number;
  truckId: (id: number) => void;
};

export const PAGE_SHOW_SIZE = 15;

const TruckListComp: FC<Props> = ({ preLoadedData = [], truckId }) => {
  const { t } = useI18n<Locale>();

  const [data, dataDispatch] = useReducer(ListReducer<TruckInfoIdDto>("id"), preLoadedData ?? []);

  const { hoverBg } = useColors();

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  }, [preLoadedData]);

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>{t("trucks.truckList.truckName")}</Th>
          <Th>{t("trucks.truckList.truckDescription")}</Th>
          <Th>{t("trucks.truckList.driver")}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map(data => (
          <Tr
            key={data.id}
            _hover={{
              bg: hoverBg
            }}>
            <Td>{data.name}</Td>
            <Td>{data.description}</Td>
            <Td>{data.driverId ?? "N/A"}</Td>
            <Td>
              <IconButton
                size="sm"
                colorScheme="gray"
                aria-label={"Open details for truck: " + data.id}
                onClick={() => truckId(data.id)}
                icon={<MdRemoveRedEye size={24} />}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TruckListComp;
