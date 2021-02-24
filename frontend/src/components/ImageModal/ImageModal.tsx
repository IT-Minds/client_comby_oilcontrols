import {
  Center,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { FC } from "react";
import { MdRemoveRedEye } from "react-icons/md";

type Props = {
  image: string;
};

const ImageModal: FC<Props> = ({ image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(image);

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="gray"
        aria-label={"openImage"}
        onClick={onOpen}
        icon={<MdRemoveRedEye size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image src={image} />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModal;
