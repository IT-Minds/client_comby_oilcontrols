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
import React, { FC, useCallback } from "react";
import { MdAdd } from "react-icons/md";
import { genRoleClient } from "services/backend/apiClients";
import { CreateRoleCommand, IRoleDto } from "services/backend/nswagts";

import CreateRoleComp from "./CreateRoleComp";

const CreateRole: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const createRole = useCallback(async (form: IRoleDto) => {
    const client = await genRoleClient();
    await client.createRole(new CreateRoleCommand({ role: form }));

    toast({
      title: "Create role successful",
      description: "Successful",
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
        aria-label={"Create Role"}
        onClick={onOpen}
        rightIcon={<MdAdd size={30} />}>
        Create Role
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateRoleComp submitCallback={createRole} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRole;