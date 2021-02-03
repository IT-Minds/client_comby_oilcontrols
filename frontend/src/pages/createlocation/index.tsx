import { Heading, useToast, VStack } from "@chakra-ui/react";
import LocaleMetaDataComp from "components/LocaleMetaDataForm/LocaleMetaDataComp";
import { LocaleMetaDataForm } from "components/LocaleMetaDataForm/LocaleMetaDataCompForm";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";
import { genLocationClient } from "services/backend/apiClients";
import { CreateLocationCommand } from "services/backend/nswagts";

const CreateLocationPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const createLocation = useCallback(
    async (form: LocaleMetaDataForm) => {
      awaitCallback(async () => {
        const client = await genLocationClient();
        const newId = await client.addNewLocation(new CreateLocationCommand(form));

        await client.saveLocationImage(newId, { data: form.image, fileName: form.image.name });

        toast({
          title: "Location successfully created",
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
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
      <Heading>Create Location</Heading>

        <LocaleMetaDataComp submitCallback={x => createLocation(x)} localeMetaData={null} />
    </VStack>
  );
};

export default CreateLocationPage;
