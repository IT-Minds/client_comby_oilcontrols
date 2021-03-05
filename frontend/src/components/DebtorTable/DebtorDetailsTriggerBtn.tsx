import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import DebtorDetailsComp from "components/DebtorDetailsComp";
import { useI18n } from "next-rosetta";
import React, { FC, useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";
import { IDebtorDto } from "services/backend/nswagts";

type Props = {
  debtorData: IDebtorDto;
};

const DebtorDetailsTriggerBtn: FC<Props> = ({ debtorData }) => {
  const { t } = useI18n<Locale>();

  const [debtor, setDebtor] = useState<IDebtorDto>(debtorData ?? {});
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (debtorData) {
      setDebtor(debtorData);
    }
  }, [debtorData]);

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="gray"
        aria-label={"Open details for debtor: " + debtor.id}
        onClick={onOpen}
        icon={<MdVisibility size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {t("debtorTable.debtorDetails.overViewOfDebtor", { debtor: debtor?.name })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <DebtorDetailsComp debtorData={debtor}></DebtorDetailsComp>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DebtorDetailsTriggerBtn;
