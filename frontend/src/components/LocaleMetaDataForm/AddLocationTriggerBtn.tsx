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
import { RefetchDataContext } from "contexts/RefetchDataContext";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useContext } from "react";
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
  const { t } = useI18n<Locale>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetchData } = useContext(RefetchDataContext);

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

      refetchData();

      toast({
        title: t("toast.createLocation"),
        description: t("toast.successful"),
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
      <Button colorScheme="green" onClick={onOpen}>
        {t("locationOverview.addNew")}{" "}
        {tankType != null
          ? (t("enums.tankType." + tankType) as string).toLowerCase()
          : t("locationOverview.location")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t("locationOverview.addNew")}{" "}
            {tankType != null
              ? (t("enums.tankType." + tankType) as string).toLowerCase()
              : t("locationOverview.location")}
          </ModalHeader>
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
