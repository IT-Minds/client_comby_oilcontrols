import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import Demo, { PAGE_SHOW_SIZE } from "components/Demo/Demo";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { genExampleClient } from "services/backend/apiClients";
import { ExampleEntityDto, PageResultOfExampleEntityDto } from "services/backend/nswagts";

// Copy this file and simply replace the `Demo` component with your other component you wish to showcase.
// Try not to edit the props of the container and box element

type Props = {
  exampleEntities: ExampleEntityDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const DemoPage: NextPage<Props> = ({ exampleEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <Demo
          buildTime={0}
          preLoadedData={exampleEntities}
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

  const data = await genExampleClient().then(client =>
    client.get("0", PAGE_SHOW_SIZE, "createdAt").catch(() => {
      return new PageResultOfExampleEntityDto({
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
