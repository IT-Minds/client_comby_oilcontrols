import {
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import DebtorDetailsComp from "components/DebtorDetailsComp";
import React, { FC, useEffect, useReducer, useState } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { DebtorDto } from "services/backend/nswagts";

import DebtorDetailsTriggerBtn from "./DebtorDetailsTriggerBtn";

type Props = {
  preLoadedData?: DebtorDto[];
};

const DebtorTableComp: FC<Props> = ({ preLoadedData = [] }) => {
  const [data, dataDispatch] = useReducer(ListReducer<DebtorDto>("dbId"), preLoadedData ?? []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [debtor, setDebtor] = useState<DebtorDto>(null);

  useEffect(() => {
    if (preLoadedData) {
      dataDispatch({
        type: ListReducerActionType.Reset,
        data: preLoadedData
      });
    }
  });

  return (
    <Container w="100%" maxW="unset">
      <Table variant="striped" colorScheme="blue" size="sm">
        <TableCaption placement="top">
          Debtor table
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Debtor name</Th>
            <Th>Debtor ID</Th>
            <Th>Uniconta ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(debtor => (
            <Tr
              key={debtor.dbId}
              onClick={() => {
                setDebtor(debtor);
                onOpen();
              }}>
              <Td>{debtor.name}</Td>
              <Td>{debtor.dbId}</Td>
              <Td>{debtor.unicontaId}</Td>
              <Td>
                <DebtorDetailsTriggerBtn debtorData={debtor} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default DebtorTableComp;
