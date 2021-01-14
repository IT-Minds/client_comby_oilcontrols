import { Container } from "@chakra-ui/react";
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { FC } from "react";
import { RefillDto } from "services/backend/nswagts";

type Props = {
  preLoadedData?: RefillDto[];
};

const FillingOverviewComp: FC<Props> = ({ preLoadedData = [] }) => {
  return (
    <Container>
      <Table variant="striped" colorScheme="teal">
        <TableCaption placement="top">Filling overview</TableCaption>
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Date</Th>
            <Th>Truck ID</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Coupon image</Th>
          </Tr>
        </Thead>
        <Tbody>
          {preLoadedData.map(data => {
            return (
              <Tr key={data.id}>
                <Td>TODO show type</Td>
                <Td>{new Date(data.actualDeliveryDate).toLocaleDateString()}</Td>
                <Td>{data.truckId}</Td>
                <Td>{data.startAmount}</Td>
                <Td>{data.endAmount}</Td>
                <Td>{data.couponId}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default FillingOverviewComp;
