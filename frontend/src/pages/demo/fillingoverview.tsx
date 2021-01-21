import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import FillingOverviewComp from "components/FillingOverview/FillingOverviewComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { genRefillClient } from "services/backend/apiClients";
import { PageResultOfRefillDto, RefillDto, TankType } from "services/backend/nswagts";

type Props = {
  refillEntities: RefillDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const DemoPage: NextPage<Props> = ({ refillEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="100%" maxH="100%" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" w="3xl" resize="both" overflow="auto">
        <FillingOverviewComp
          preLoadedData={refillEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}
        />
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<Props & I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  const data = await genRefillClient().then(client =>
    client.get("0").catch(() => {
      return new PageResultOfRefillDto({
        hasMore: true,
        newNeedle: "0",
        pagesRemaining: 1,
        results: [
          new RefillDto({
            couponId: 3,
            actualDeliveryDate: new Date("2021-02-05"),
            id: 1,
            locationType: TankType.BUILDING,
            truckId: 5,
            startAmount: 2,
            endAmount: 100
          }),
          new RefillDto({
            couponId: 4,
            actualDeliveryDate: new Date("2021-02-06"),
            id: 2,
            locationType: TankType.SHIP,
            truckId: 5,
            startAmount: 20,
            endAmount: 150
          })
        ]
      });
    })
  );

  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
      refillEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle,
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default DemoPage;
