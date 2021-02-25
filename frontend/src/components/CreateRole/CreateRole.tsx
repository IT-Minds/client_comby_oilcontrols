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
import React, { FC, useCallback, useState } from "react";
import { MdAdd } from "react-icons/md";
import { genRoleClient } from "services/backend/apiClients";
import { CreateRoleCommand, IRoleDto, UpdateRoleCommand } from "services/backend/nswagts";

import CreateRoleComp from "./CreateRoleComp";

const CreateRole: FC = () => {
  const { t } = useI18n<Locale>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [administrate, setAdministrate] = useState<boolean>();

  const createRole = useCallback(async (form: IRoleDto) => {
    const client = await genRoleClient();
    await client.createRole(new CreateRoleCommand({ role: form }));

    onClose();

    toast({
      title: t("users.createRole"),
      description: t("toast.successful"),
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, []);

  const updateRole = useCallback(async (form: IRoleDto) => {
    const client = await genRoleClient();
    await client.updateRole(new UpdateRoleCommand({ role: form }));

    onClose();

    toast({
      title: t("users.updateRole"),
      description: t("toast.successful"),
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
        onClick={() => {
          setAdministrate(false);
          onOpen();
        }}
        rightIcon={<MdAdd size={30} />}>
        {t("users.createRole")}
      </Button>

      <Button
        size="sm"
        colorScheme="green"
        aria-label={"Administrate Roles"}
        onClick={() => {
          setAdministrate(true);
          onOpen();
        }}
        rightIcon={<MdAdd size={30} />}>
        {t("users.administrateRoles")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {administrate ? t("users.administrateRoles") : t("users.createRole")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateRoleComp
              submitCallback={createRole}
              submitUpdateCallback={updateRole}
              isAdministrate={administrate}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRole;
