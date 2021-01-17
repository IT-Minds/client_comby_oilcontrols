import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps } from "next-rosetta";

type Props = {
  // buildTime: number;
};

const IndexPage: NextPage<Props> = () => {
  return (
    <main>
      <Head>
        <title>Oil Control - landing page</title>
      </Head>
      <Flex>
        <Container maxW="xl" centerContent>
          <Heading>Landing Page</Heading>
          <Text fontSize="xl">Just some info text</Text>
        </Container>
      </Flex>
    </main>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table } };
};

export default IndexPage;
