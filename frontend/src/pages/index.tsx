import { Box, Container, Heading, Slide, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

type Props = {
  buildTime: number;
};

const IndexPage: NextPage<Props> = () => {
  return (
    <main>
      <Head>
        <title>Oil Control - landing page</title>
      </Head>
      <Container maxW="xl" centerContent>
        <Heading>Landing Page</Heading>
        <Text fontSize="xl">Just some info text</Text>
      </Container>

      <Slide direction="bottom" in={true} style={{ zIndex: 10 }}>
        <Box p="40px" color="white" mt="4" bg="green.600" rounded="md" shadow="md">
          This page is still under development. Head over to
          <Text color="blue.400" as="a">
            <Link href="/demo">
              <a> the Demo area </a>
            </Link>
          </Text>
          to see all demo-able components
        </Box>
      </Slide>
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
