import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import InvalidateCouponBtn from "components/InvalidateCouponBtn/InvalidateCouponBtn";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import { CouponDto, CouponStatus } from "services/backend/nswagts";

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

          <InvalidateCouponBtn
            coupon={
              new CouponDto({
                couponNumber: 2,
                status: CouponStatus.USED,
                truckId: 5
              })
            }
          />
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
