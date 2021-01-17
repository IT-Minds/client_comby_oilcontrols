import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import CouponOverviewComp from "components/CouponOverview/CouponOverviewComponent";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";

const DemoPage: NextPage = () => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CouponOverviewComp
          car="123"
          coupons={[
            { start: 1, end: 7, id: "1" },
            { start: 13, end: 25, id: "2" },
            { start: 2173, end: 2340, id: "3" }
          ]}></CouponOverviewComp>
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
