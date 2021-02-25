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
import { useI18n } from "next-rosetta";
import { FC } from "react";
import { GiFuelTank } from "react-icons/gi";

import FillOutRefillForm from "./FillOutRefillForm";

const RefillModalBtn: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="orange"
        aria-label={"Order refill"}
        onClick={onOpen}
        icon={<GiFuelTank size={30} />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("mytruck.refill.refill")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FillOutRefillForm submitCallback={null} couponNumbers={[]} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RefillModalBtn;
