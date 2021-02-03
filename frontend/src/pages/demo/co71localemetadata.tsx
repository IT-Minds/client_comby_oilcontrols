import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import LocaleMetaDataComp from "components/LocaleMetaDataForm/LocaleMetaDataComp";
import { LocaleMetaDataForm } from "components/LocaleMetaDataForm/LocaleMetaDataCompForm";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";
import { genLocationClient } from "services/backend/apiClients";
import { AddDebtorToLocationCommand, CreateLocationCommand, UpdateLocationMetaDataCommand } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const saveForm = useCallback(
    async (form: LocaleMetaDataForm) => {
      awaitCallback(async () => {
        const client = await genLocationClient();
        const newId = await (form.id
          ? client.updateMetaData(form.id, new UpdateLocationMetaDataCommand(form))
          : client.addNewLocation(new CreateLocationCommand(form)));

        await client.saveLocationImage(newId, { data: form.image, fileName: form.image.name });
        await client.addDebtor(new AddDebtorToLocationCommand({
          locationId: newId
        }))

        toast({
          title: "Filldata created/updated",
          description: "Successful",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <LocaleMetaDataComp submitCallback={x => saveForm(x)} localeMetaData={null} />
      </Box>
    </Container>
  );
};

export default DemoPage;
