import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import DebtorDetailsComp from "components/DebtorDetailsComp";
import React, { FC, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { IDebtorDto } from "services/backend/nswagts";

type Props = {
  debtorData: IDebtorDto;
};

const DebtorDetailsTriggerBtn: FC<Props> = ({ debtorData }) => {
  const [debtor, setDebtor] = useState<IDebtorDto>(debtorData ?? {});
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="gray"
        aria-label={"Open details for debtor: " + debtor.dbId}
        onClick={onOpen}
        icon={<MdModeEdit size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Overview of debtor {debtor?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DebtorDetailsComp debtorData={debtor}></DebtorDetailsComp>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DebtorDetailsTriggerBtn;
