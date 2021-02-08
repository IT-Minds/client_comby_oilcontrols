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
import { FC } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { LocationDetailsIdDto } from "services/backend/nswagts";

import LocationHistoryComp from "./LocationHistoryComp";

type Props = {
  data: LocationDetailsIdDto;
};

const ViewLocationHistoryModalBtn: FC<Props> = ({ data }) => {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="gray"
        aria-label={"Open history for location: " + data.id}
        onClick={onOpen}
        icon={<MdRemoveRedEye size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>MY TITLE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LocationHistoryComp locationId={data.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewLocationHistoryModalBtn;
