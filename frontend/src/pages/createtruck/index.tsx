import { Heading, useToast, VStack } from "@chakra-ui/react";
import AddTruckMetaData from "components/TruckMetaData/AddTruckMetaData";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React, { useCallback } from "react";
import { genTruckClient } from "services/backend/apiClients";
import { CreateTruckCommand } from "services/backend/nswagts";

const CreateTruckPage: NextPage = () => {
  const toast = useToast();
  const { awaitCallback } = useOffline();

  const createTruck = useCallback(
    async form => {
      awaitCallback(async () => {
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
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
        {
            //TODO: translation
        }
        <Heading>Create Truck</Heading>

        <AddTruckMetaData submitCallback={x => createTruck(x)} truckMetaData={null}></AddTruckMetaData>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table } };
};

export default CreateTruckPage;
