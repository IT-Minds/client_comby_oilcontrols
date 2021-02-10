import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { FC } from "react";
import { MdEdit } from "react-icons/md";
import { IUserIdDto } from "services/backend/nswagts";

type Props = {
  user: IUserIdDto;
};

const UserDetailModal: FC<Props> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        size="sm"
        onClick={onOpen}
        aria-label="Open Details for user"
        icon={<MdEdit size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage User {user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Change Password</Text>
            <Text>Change Role</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserDetailModal;
