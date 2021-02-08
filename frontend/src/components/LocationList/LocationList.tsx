import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import RefillModalBtn from "components/FillOutRefillForm/RefillModalBtn";
import EditLocationTriggerBtn from "components/LocaleMetaDataForm/EditLocationTriggerBtn";
import ViewLocationHistoryModalBtn from "components/LocationHistory/ViewLocationHistoryModalBtn";
import OrderRefillComp from "components/OrderRefill/OrderRefillComp";
import { useColors } from "hooks/useColors";
import { FC } from "react";
import { LocationDetailsIdDto, RefillSchedule } from "services/backend/nswagts";

type Props = {
  data: LocationDetailsIdDto[];
};

const LocationList: FC<Props> = ({ data }) => {
  const { hoverBg } = useColors();

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Address</Th>
          <Th>Region Id</Th>
          <Th>Schedule Type</Th>
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
            <Td>{dat.address}</Td>
            <Td>{dat.regionId}</Td>
            <Td>{RefillSchedule[dat.schedule]}</Td>
            <Td>
              <HStack>
                <EditLocationTriggerBtn data={dat} />

                <ViewLocationHistoryModalBtn data={dat} />

                <OrderRefillComp locationId={dat.id} submitCallback={null} />

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
