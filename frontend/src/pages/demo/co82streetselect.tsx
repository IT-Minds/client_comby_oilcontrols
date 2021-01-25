import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import StreetSelector from "components/StreetSelector/StreetSelector";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";

type Props = {
  //
};

const DemoPage: NextPage<Props> = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <StreetSelector cb={s => alert(JSON.stringify(s))} />
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
    }
  };
};

export default DemoPage;
