import { Heading, useToast, VStack } from "@chakra-ui/react";
import AddDailyTemperatureComp from "components/DailyTemperature/AddDailyTemperature";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback } from "react";
import { genDailyTemperatureClient } from "services/backend/apiClients";
import {
  CreateDailyTemperatureCommand,
  ICreateDailyTemperatureCommand
} from "services/backend/nswagts";

const MyPage: NextPage = () => {
  const { t } = useI18n<Locale>();
  const toast = useToast();

  const saveDailyTemperature = useCallback(
    async (dailyTemperature: ICreateDailyTemperatureCommand) => {
      const client = await genDailyTemperatureClient();
      await client.create(
        new CreateDailyTemperatureCommand({
          date: dailyTemperature.date,
          regionId: dailyTemperature.regionId,
          temperature: dailyTemperature.temperature
        })
      );

      toast({
        title: t("toast.createTemperature"),
        description: t("toast.successful"),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    },
    []
  );

  return (
    <VStack w="100%">
      <Heading>{t("dailyTemperature.addDailyTemperature")}</Heading>
      <AddDailyTemperatureComp submitCallback={saveDailyTemperature} />
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  let { table = {} } = await import(`../i18n/${locale}`);
  table = runTimeTable(locale, table);

  return {
    props: {
      table
    }
  };
};

export default MyPage;
