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
import React, { FC, useCallback } from "react";
import { genTruckClient } from "services/backend/apiClients";
import { CreateTruckCommand, TruckInfoDto } from "services/backend/nswagts";

const AddTruckTriggerBtn: FC = () => {
  const toast = useToast();

  const createTruck = useCallback(async (form: TruckInfoDto) => {
    const client = await genTruckClient();
    await client.createTruck(
      new CreateTruckCommand({
        truckInfo: form
      })
    );

    toast({
      title: "Truck successfully created",
      description: "Successful",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Add new Truck
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new Truck</ModalHeader>
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
