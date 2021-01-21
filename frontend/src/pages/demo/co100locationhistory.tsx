import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import { PAGE_SHOW_SIZE } from "components/Demo/Demo";
import { LocationHistory } from "components/LocationHistory/LocationHistory";
import LocationHistoryComp from "components/LocationHistory/LocationHistoryComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";

type Props = {
  exampleEntities: LocationHistory[]; //LocationHistoryDto[];
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
          preLoadedPageCount={pageCount}></LocationHistoryComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  //TODO - WAITING FOR BACKEND
  // const data = await getHistoryLocationClient().then(client =>
  //   client.get("0", PAGE_SHOW_SIZE, "createdAt").catch(() => {
  //     return new PageResultOfLocationHistoryDto({
  //       hasMore: true,
  //       newNeedle: "0",
  //       pagesRemaining: 1,
  //       results: []
  //     });
  //   })
  // );

  return { props: { table } };
};

export default DemoPage;
