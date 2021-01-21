import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import AddTruckMetaData from "components/TruckMetaData/AddTruckMetaData";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";

const DemoPage: NextPage = () => {
  const toast = useToast();
  const { awaitCallback } = useOffline();
  const bg = useColorModeValue("gray.100", "gray.700");

  const saveForm = useCallback(
    async truckMetaDataForm => {
      awaitCallback(async () => {
        // TODO: WAITING FOR BACKEND COMMAND + INTERFACE
        // const client = await genRefillClient();
        // await client.create(
        //   new CreateRefillCommand({
        //     truckNumber: truckMetaDataForm.truckNumber,
        //     name: truckMetaDataForm.name,
        //     description: truckMetaDataForm.description,
        //     tankCapacity: truckMetaDataForm.tankCapacity
        //   })
        // );

        toast({
          title: "Truck Meta Data Saved",
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
        <AddTruckMetaData submitCallback={x => saveForm(x)}></AddTruckMetaData>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table } };
};

export default DemoPage;
