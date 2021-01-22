import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import LocaleMetaDataComp from "components/LocaleMetaDataForm/LocaleMetaDataComp";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";
import { genLocationClient } from "services/backend/apiClients";
import {
  IUpdateLocationMetaDataCommand,
  UpdateLocationMetaDataCommand
} from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const saveForm = useCallback(
    async (form: IUpdateLocationMetaDataCommand) => {
      awaitCallback(async () => {
        const client = await genLocationClient();
        await client.updateMetaData(
          new UpdateLocationMetaDataCommand({
            address: form.address,
            comment: form.comment,
            estimateConsumption: form.estimateConsumption,
            locationId: form.locationId,
            refillschedule: form.refillschedule,
            tankType: form.tankType,
            tankNumber: form.tankNumber,
            tankCapacity: form.tankCapacity,
            minimumFuelAmount: form.minimumFuelAmount
          })
        );

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
        <LocaleMetaDataComp submitCallback={x => saveForm(x)} />
      </Box>
    </Container>
  );
};

export default DemoPage;
