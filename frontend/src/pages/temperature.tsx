import { Heading, toast, useToast, VStack } from "@chakra-ui/react";
import AddDailyTemperatureComp from "components/DailyTemperature/AddDailyTemperature";
import { useEffectAsync } from "hooks/useEffectAsync";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";
import { genDailyTemperatureClient, genLocationClient } from "services/backend/apiClients";
import {
  CreateDailyTemperatureCommand,
  ICreateDailyTemperatureCommand,
  LocationDetailsIdDto
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
        title: "Coupons Saved",
        description: "Successful",
        status: "success",
        duration: 9000,
        isClosable: true
      });
    },
    []
  );

  return (
    <VStack w="100%">
      <VStack>
        <Heading>{t("dailyTemperature.addDailyTemperature")}</Heading>
        <AddDailyTemperatureComp
          regions={[{ id: "0", name: "123" }]}
          submitCallback={x => {
            saveDailyTemperature(x);
          }}
        />
      </VStack>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);

  return {
    props: {
      table
    }
  };
};

export default MyPage;
