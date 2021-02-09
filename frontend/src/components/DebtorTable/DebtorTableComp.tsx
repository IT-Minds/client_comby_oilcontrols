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
        <TableCaption placement="top">Debtor table</TableCaption>
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
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Overview of debtor {debtor?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DebtorDetailsComp debtorData={debtor}></DebtorDetailsComp>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default DebtorTableComp;
