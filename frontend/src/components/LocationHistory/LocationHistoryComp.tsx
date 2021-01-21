import { Table, TableCaption, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { FC } from "react";

import { LocationHistory } from "./LocationHistory";

type Props = {
  locationHistories: LocationHistory[];
};

const LocationHistoryComp: FC<Props> = ({ locationHistories }) => {
  return (
    <Table variant="striped" colorScheme="teal">
      <TableCaption placement="top">Location History</TableCaption>
      <Thead>
        <Tr>
          <Th>Location</Th>
          <Th>Id</Th>
        </Tr>
      </Thead>
      <Tbody>
        {locationHistories.map(lh => (
          <tr key={lh.locationId}>
            <td>{lh.name}</td>
            <td>{lh.locationId}</td>
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default LocationHistoryComp;
