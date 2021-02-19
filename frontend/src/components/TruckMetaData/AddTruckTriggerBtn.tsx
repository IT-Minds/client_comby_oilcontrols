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
import AddTruckMetaData from "components/TruckMetaData/AddTruckMetaData";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback } from "react";
import { genTruckClient } from "services/backend/apiClients";
import { CreateTruckCommand, TruckInfoDto } from "services/backend/nswagts";

const AddTruckTriggerBtn: FC = () => {
  const { t } = useI18n<Locale>();

  const toast = useToast();

  const createTruck = useCallback(async (form: TruckInfoDto) => {
    const client = await genTruckClient();
    await client.createTruck(
      new CreateTruckCommand({
        truckInfo: form
      })
    );

    toast({
      title: t("toast.createTruck"),
      description: t("toast.successful"),
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        {t("trucks.addTruckTrigger.addNewTruck")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("trucks.addTruckTrigger.addNewTruck")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddTruckMetaData submitCallback={createTruck} truckMetaData={null} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTruckTriggerBtn;
