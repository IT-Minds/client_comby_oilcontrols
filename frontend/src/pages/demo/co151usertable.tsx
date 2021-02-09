import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import UserTableComp from "components/UserTable/UserTableComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React from "react";
import { UserDto } from "services/backend/nswagts";

type Props = {
  userEntities: UserDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const DemoPage: NextPage<Props> = ({ userEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <UserTableComp
          preLoadedData={userEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}></UserTableComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  {
    //TODO: waiting for getUsers and PageResult type
  }
  //   const data = await genUserClient().then(client =>
  //     client.getUsers().catch(() => {
  //       return new PageResultOfLocationHistoryDtoAndString({
  //         hasMore: true,
  //         newNeedle: "0",
  //         pagesRemaining: 1,
  //         results: []
  //       });
  //     })
  //   );

  {
    //TODO: waiting 'data'
  }
  return {
    props: {
      table
      // !This is a hack to get around undefined values in dataset
      // exampleEntities: JSON.parse(JSON.stringify(data.results)),
      // needle: data.newNeedle ?? "0",
      // hasMore: data.hasMore,
      // pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default DemoPage;
