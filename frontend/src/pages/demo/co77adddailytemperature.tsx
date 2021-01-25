import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import AddDailyTemperatureComp from "components/DailyTemperature/AddDailyTemperature";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genDailyTemperatureClient } from "services/backend/apiClients";
import { CreateDailyTemperatureCommand } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();
  const { awaitCallback } = useOffline();
  const bg = useColorModeValue("gray.100", "gray.700");

  const saveForm = useCallback(
    async dailyTemperature => {
      awaitCallback(async () => {
        const client = await genDailyTemperatureClient();
        await client.create(
          new CreateDailyTemperatureCommand({
            date: dailyTemperature.date,
            regionId: dailyTemperature.regionId,
            temperature: dailyTemperature.temperature
          })
        );

        toast({
          title: "Daily Temperature Created",
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
        <AddDailyTemperatureComp
          submitCallback={x => saveForm(x)}
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
