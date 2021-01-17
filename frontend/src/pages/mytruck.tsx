import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";

import { Locale } from "../i18n/Locale";

type Props = {
  //
};

const LocalePage: NextPage<Props> = () => {
  const { t } = useI18n<Locale>();

  return (
    <main>
      <Head>
        <title>Oil Control - Trucker Page</title>
      </Head>
      <Flex>
        <Container maxW="xl" centerContent>
          <Heading>{t("title")}</Heading>
          <Text fontSize="xl">Just some info text</Text>
        </Container>
      </Flex>
    </main>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table }, revalidate: 5 * 60 };
};

export default LocalePage;
