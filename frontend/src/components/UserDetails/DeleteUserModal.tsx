import {
  Button,
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
import { useI18n } from "next-rosetta";
import React, { FC, useCallback } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { genUserClient } from "services/backend/apiClients";
import { IUserIdDto } from "services/backend/nswagts";

type Props = {
  user: IUserIdDto;
  userCallback: (user: IUserIdDto) => void;
};

const DeleteUserModal: FC<Props> = ({ user, userCallback }) => {
  const { t } = useI18n<Locale>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteUser = useCallback(async () => {
    const client = await genUserClient();
    await client.deleteUser(user.id);

    onClose();

    toast({
      title: t("toast.deleteUser"),
      description: t("toast.successful"),
      status: "success",
      duration: 9000,
      isClosable: true
    });
    userCallback({ ...user });
  }, []);

  return (
    <>
      <IconButton
        size="sm"
        onClick={onOpen}
        aria-label="Open Delete User"
        icon={<MdDelete size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t("users.userDetailsTable.deleteUserModal.deleteUserInfo", { user: user.username })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              mt={4}
              colorScheme="red"
              rightIcon={<MdDelete />}
              onClick={() => {
                deleteUser();
              }}>
              {t("users.userDetailsTable.deleteUserModal.deleteUser")}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteUserModal;
