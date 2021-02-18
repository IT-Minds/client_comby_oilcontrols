import {
  Button,
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
import { MdAdd } from "react-icons/md";
import { genUserClient } from "services/backend/apiClients";
import { CreateUserCommand, ICreateUserCommand } from "services/backend/nswagts";

import CreateUserComp from "./CreateUserComp";

const CreateUser: FC = () => {
  const { t } = useI18n<Locale>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const createRole = useCallback(async (createUserForm: ICreateUserCommand) => {
    const client = await genUserClient();
    await client.createUser(new CreateUserCommand(createUserForm));

    toast({
      title: "Success",
      description: "Created user successfully",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, []);

  return (
    <>
      <Button
        size="sm"
        colorScheme="green"
        aria-label={"Create user"}
        onClick={onOpen}
        rightIcon={<MdAdd size={30} />}>
        {t("users.createUser")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("users.createUser")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateUserComp submitCallback={createRole} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateUser;
