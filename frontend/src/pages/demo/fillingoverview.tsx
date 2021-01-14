import { Box, Container } from "@chakra-ui/react";
import FillingOverviewComp from "components/FillingOverview/FillingOverviewComp";
import { GetServerSideProps, NextPage } from "next";
import { genRefillClient } from "services/backend/apiClients";
import { PageResultOfRefillDto, RefillDto } from "services/backend/nswagts";

type Props = {
  refillEntities: RefillDto[];
};

const DemoPage: NextPage<Props> = ({ refillEntities }) => {
  return (
    <Container maxW="100%" maxH="100%" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <FillingOverviewComp
          preLoadedData={refillEntities}></FillingOverviewComp>
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
  console.log(data);

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
