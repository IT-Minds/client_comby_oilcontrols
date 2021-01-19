import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import AddDailyTemperatureComp from "components/DailyTemperature/AddDailyTemperature";
import { AddDailyTemperatureForm } from "components/DailyTemperature/AddDailyTemperatureForm";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useEffect, useState } from "react";

const DemoPage: NextPage = () => {
  const [addDailyTemperatureForm, setDailyTemperatureForm] = useState<AddDailyTemperatureForm>(
    null
  );
  const toast = useToast();
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    if (addDailyTemperatureForm) {
      toast({
        title: "Daily temperature added",
        description: JSON.stringify(addDailyTemperatureForm),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  }, [addDailyTemperatureForm]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <AddDailyTemperatureComp
          submitCallback={x => setDailyTemperatureForm(x)}
          regions={[
            { name: "Region 1", id: "1" },
            { name: "Region 2", id: "2" },
            { name: "Region 3", id: "3" }
          ]}></AddDailyTemperatureComp>
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
