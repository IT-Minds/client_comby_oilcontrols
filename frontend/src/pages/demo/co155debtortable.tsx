import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import DebtorTableComp from "components/DebtorTable/DebtorTableComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { PageResultOfLocationDebtorHistoryDtoAndDateTime, DebtorDto } from "services/backend/nswagts";

type Props = {
  debtorEntities: DebtorDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const DemoPage: NextPage<Props> = ({ debtorEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <DebtorTableComp
          preLoadedData={debtorEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}></DebtorTableComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

    const data = await genDebtorClient().then(client =>
      client.get().catch(() => {
        return new PageResultOfLocationDebtorHistoryDtoAndDateTime({
          hasMore: true,
          newNeedle: new Date(),
          pagesRemaining: 1,
          results: []
        });
      })
    );

  {
    //TODO: waiting 'data'
  }
  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
       debtorEntities: JSON.parse(JSON.stringify(data)),
       needle: data.newNeedle ?? "0",
       hasMore: data.hasMore,
       pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default DemoPage;
