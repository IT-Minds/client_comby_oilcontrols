import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import FillingOverviewComp from "components/FillingOverview/FillingOverviewComp";
import { GetServerSideProps, NextPage } from "next";
import { genRefillClient } from "services/backend/apiClients";
import { PageResultOfRefillDto, RefillDto } from "services/backend/nswagts";

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
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <FillingOverviewComp
          preLoadedData={refillEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}></FillingOverviewComp>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data = await genRefillClient()
    .get(0, 55, "0", 10, 0)
    .catch(() => {
      return new PageResultOfRefillDto({
        hasMore: true,
        newNeedle: "0",
        pagesRemaining: 1,
        results: []
      });
    });

  return {
    props: {
      // !This is a hack to get around undefined values in dataset
      refillEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle,
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    }
  };
};

export default DemoPage;
