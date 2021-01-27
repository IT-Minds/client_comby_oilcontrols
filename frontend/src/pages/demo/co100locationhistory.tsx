import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import LocationHistoryComp from "components/LocationHistory/LocationHistoryComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { genLocationHistoryClient } from "services/backend/apiClients";
import {
  LocationHistoryDto,
  PageResultOfLocationHistoryDtoAndString
} from "services/backend/nswagts";

type Props = {
  exampleEntities: LocationHistoryDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const DemoPage: NextPage<Props> = ({ exampleEntities, needle, hasMore, pageCount }) => {
  const toast = useToast();
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <LocationHistoryComp
          preLoadedData={exampleEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}
          locationId={1}></LocationHistoryComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  const data = await genLocationHistoryClient().then(client =>
    client.getLocationHistory(1).catch(() => {
      return new PageResultOfLocationHistoryDtoAndString({
        hasMore: true,
        newNeedle: "0",
        pagesRemaining: 1,
        results: []
      });
    })
  );

  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
      exampleEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle ?? "0",
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default DemoPage;
