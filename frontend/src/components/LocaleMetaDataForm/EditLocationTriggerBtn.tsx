import {
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
import { RefetchDataContext } from "contexts/RefetchDataContext";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import { genLocationClient } from "services/backend/apiClients";
import {
  AddDebtorToLocationCommand,
  ILocationDetailsIdDto,
  LocationDetailsIdDto,
  RemoveDebtorFromLocationCommand,
  UpdateDebtorOnLocationCommand,
  UpdateLocationMetaDataCommand
} from "services/backend/nswagts";

import LocaleMetaDataComp from "./LocaleMetaDataComp";

type Props = {
  data: ILocationDetailsIdDto;
};

const EditLocationTriggerBtn: FC<Props> = ({ data = null }) => {
  const toast = useToast();
  const { t } = useI18n<Locale>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetchData } = useContext(RefetchDataContext);

  const updateLocation = useCallback(
    async (
      reportForm: ILocationDetailsIdDto,
      addDebtors: AddDebtorToLocationCommand[],
      updateDebtors: UpdateDebtorOnLocationCommand[],
      removeDebtors: RemoveDebtorFromLocationCommand[],
      image: File
    ) => {
      const client = await genLocationClient();

      const data = new LocationDetailsIdDto();
      data.init(reportForm);
      const newId = await client.updateMetaData(
        data.id,
        new UpdateLocationMetaDataCommand({
          data
        })
      );

      // await client.saveLocationImage(newId, {
      //   data: image,
      //   fileName: newId + ".webp"
      // });
      if (image) {
        await client.saveLocationImage(newId, {
          data: image,
          fileName: newId + ".webp"
        });
      }

      await Promise.all(
        removeDebtors.map(x =>
          client.removeDebtor(new RemoveDebtorFromLocationCommand({ ...x, locationId: newId }))
        )
      );

      //TODO: can be used when the backend is ready for the UPDATE command
      // await Promise.all(
      //   updateDebtors.map(x =>
      //     client.updateDebtor(new UpdateDebtorOnLocationCommand({ ...x, locationId: newId }))
      //   )
      // );

      await Promise.all(
        addDebtors.map(x =>
          client.addDebtor(new AddDebtorToLocationCommand({ ...x, locationId: newId }))
        )
      );

      toast({
        title: t("toast.updateLocation"),
        description: t("toast.successful"),
        status: "success",
        duration: 9000,
        isClosable: true
      });

      refetchData();
      onClose();
    },
    []
  );

  return (
    <>
      <IconButton
        size="sm"
        colorScheme="gray"
        aria-label={"Open details for location: " + data.id}
        onClick={onOpen}
        icon={<MdModeEdit size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("locationOverview.editLocation")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LocaleMetaDataComp submitCallback={updateLocation} localeMetaData={data} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditLocationTriggerBtn;
