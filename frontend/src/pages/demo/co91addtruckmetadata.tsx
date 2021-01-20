import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import AddTruckMetaData from "components/TruckMetaData/AddTruckMetaData";
import { AddTruckMetaDataForm } from "components/TruckMetaData/AddTruckMetaDataForm";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useEffect, useState } from "react";

const DemoPage: NextPage = () => {
  const [addTruckMetaDataForm, setTruckMetaDataForm] = useState<AddTruckMetaDataForm>(null);
  const toast = useToast();
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    if (addTruckMetaDataForm) {
      toast({
        title: "Truck meta data added",
        description: JSON.stringify(addTruckMetaDataForm),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  }, [addTruckMetaDataForm]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <AddTruckMetaData submitCallback={x => setTruckMetaDataForm(x)}></AddTruckMetaData>
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
