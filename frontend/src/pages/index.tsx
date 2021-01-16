import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

type Props = {
  buildTime: number;
};

const IndexPage: NextPage<Props> = () => {
  return (
    <main>
      <Head>
        <title>Oil Control - landing page</title>
      </Head>
      <Flex>
        <Container maxW="xl" centerContent>
          <Heading>Landing Page</Heading>
          <Text fontSize="xl">Just some info text</Text>
        </Container>
      </Flex>
    </main>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      buildTime: Date.now()
    }
  };
};

export default IndexPage;
