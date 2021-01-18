import { Box, Container } from "@chakra-ui/react";
import CarInfoComp from "components/CarInfo/CarInfoComp";
import { CarInfoForm } from "components/CarInfo/CarInfoForm";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";

const DemoPage: NextPage = () => {
  const [carInfoForm, setCarInfoForm] = useState<CarInfoForm>(null);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CarInfoComp car={"123"} submitCallback={x => setCarInfoForm(x)}></CarInfoComp>
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
