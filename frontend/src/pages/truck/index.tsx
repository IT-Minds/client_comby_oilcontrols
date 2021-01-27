import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import TruckListComp from "components/TruckList/TruckListComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";
import { genTruckClient } from "services/backend/apiClients";
import { PageResultOfTruckInfoIdDtoAndInteger, TruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  truckEntities: TruckInfoIdDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const TruckPage: NextPage<Props> = ({ truckEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const [truckId, setTruckId] = useState(null);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <TruckListComp
          preLoadedData={truckEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}
          truckId={setTruckId}
        />
        {truckId}
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  const data = await genTruckClient().then(client =>
    client.getTrucks(0).catch(() => {
      return new PageResultOfTruckInfoIdDtoAndInteger({
        hasMore: true,
        newNeedle: 0,
        pagesRemaining: 1,
        results: [
          new TruckInfoIdDto({
            name: "Truck 1",
            description: "A big truck",
            refillNumber: 1,
            tankCapacity: 123,
            truckIdentifier: "1",
            id: 0
          }),
          new TruckInfoIdDto({
            name: "Truck 2",
            description: "A small truck",
            refillNumber: 2,
            tankCapacity: 456,
            truckIdentifier: "2",
            id: 1
          })
        ]
      });
    })
  );

  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
      truckEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle ?? "0",
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default TruckPage;
