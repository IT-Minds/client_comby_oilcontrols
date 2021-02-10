import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import DebtorTableComp from "components/DebtorTable/DebtorTableComp";
import { useEffectAsync } from "hooks/useEffectAsync";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React, { useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const [debtorEntities, setDebtorEntities] = useState<DebtorDto[]>(null);
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffectAsync(async () => {
    const data = await genDebtorClient().then(client => client.get());
    setDebtorEntities(data);
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <DebtorTableComp preLoadedData={debtorEntities}></DebtorTableComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../i18n/${locale}`);

  return {
    props: {
      table
    },
    revalidate: 60
  };
};

export default DemoPage;
