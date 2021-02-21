import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffectAsync } from "hooks/useEffectAsync";
import { Locale } from "i18n/Locale";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps } from "next-rosetta";
import { useState } from "react";
import { genTruckClient } from "services/backend/apiClients";
import { TruckInfoIdDto } from "services/backend/nswagts";

import MyTruck from "./mytruck";

type Props = {
  // buildTime: number;
};

const IndexPage: NextPage<Props> = () => {
  const [trucks, setTrucks] = useState<TruckInfoIdDto[]>([]);

  useEffectAsync(async () => {
    const client = await genTruckClient();
    const trucks = await client.getTrucks();

    setTrucks(trucks.results);
  }, []);

  return (
    <>
      <Head>
        <title>Oil Control - landing page</title>
      </Head>
      <Container maxW="8xl" centerContent>
        {trucks.map(truck => (
          <MyTruck key={truck.id} coupons={[]} truckInfo={truck} viewOnly={true} />
        ))}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  let { table = {} } = await import(`../i18n/${locale}`);
  table = runTimeTable(locale, table);
  return { props: { table } };
};

export default IndexPage;
