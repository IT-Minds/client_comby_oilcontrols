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
import { TruckContext } from "contexts/TruckContext";
import { useI18n } from "next-rosetta";
import { FC, useContext } from "react";
import { GiFuelTank } from "react-icons/gi";
import { ILocationRefillDto } from "services/backend/nswagts";

import FillOutRefillForm from "./FillOutRefillForm";

type Props = {
  refill: ILocationRefillDto;
};

const RefillModalBtn: FC<Props> = ({ refill }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();

  const { completeLocationRefill, coupons } = useContext(TruckContext);

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
            <FillOutRefillForm
              submitCallback={x => completeLocationRefill(x, refill)}
              couponNumbers={coupons.map(x => ({
                id: x.id,
                name: x.couponNumber
              }))}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RefillModalBtn;
