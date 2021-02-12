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
import { genLocationClient } from "services/backend/apiClients";
import {
  AddDebtorToLocationCommand,
  CreateLocationCommand,
  ILocationDetailsDto,
  LocationDetailsDto,
  TankType
} from "services/backend/nswagts";

import LocaleMetaDataComp from "./LocaleMetaDataComp";

type Props = {
  tankType?: TankType;
};

const AddLocationTriggerBtn: FC<Props> = ({ tankType = null }) => {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const createLocation = useCallback(
    async (reportForm: ILocationDetailsDto, debtors: AddDebtorToLocationCommand[], image: File) => {
      const client = await genLocationClient();

      const data = new LocationDetailsDto();
      data.init(reportForm);
      const newId = await client.addNewLocation(
        new CreateLocationCommand({
          data
        })
      );

      if (image)
        await client.saveLocationImage(newId, {
          data: image,
          fileName: newId + ".webp"
        });

      await Promise.all(
        debtors.map(x =>
          client.addDebtor(new AddDebtorToLocationCommand({ ...x, locationId: newId }))
        )
      );

      toast({
        title: "Truck successfully created",
        description: "Successful",
        status: "success",
        duration: 9000,
        isClosable: true
      });

      onClose();
    },
    []
  );

  return (
    <>
      {
        //TODO: translation
      }
      <Button colorScheme="green" onClick={onOpen}>
        Add new {tankType != null ? TankType[tankType] : "Location"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          {
            //TODO: translation
          }
          <ModalHeader>Add new {tankType != null ? TankType[tankType] : "Location"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LocaleMetaDataComp submitCallback={createLocation} localeMetaData={{ tankType }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddLocationTriggerBtn;
