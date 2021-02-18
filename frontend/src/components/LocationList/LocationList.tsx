import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import RefillModalBtn from "components/FillOutRefillForm/RefillModalBtn";
import EditLocationTriggerBtn from "components/LocaleMetaDataForm/EditLocationTriggerBtn";
import ViewLocationHistoryModalBtn from "components/LocationHistory/ViewLocationHistoryModalBtn";
import OrderRefillComp from "components/OrderRefill/OrderRefillComp";
import { useColors } from "hooks/useColors";
import { useI18n } from "next-rosetta";
import { FC, useCallback } from "react";
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

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>{t("locationList.address")}</Th>
          <Th>{t("locationList.regionId")}</Th>
          <Th>{t("locationList.scheduleType")}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map(dat => (
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
