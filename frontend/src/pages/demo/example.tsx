import { Box, Container } from "@chakra-ui/react";
import Demo, { PAGE_SHOW_SIZE } from "components/Demo/Demo";
import { GetServerSideProps, NextPage } from "next";
import { genExampleClient } from "services/backend/apiClients";
import { ExampleEntityDto } from "services/backend/nswagts";

// Copy this file and simply replace the `Demo` component with your other component you wish to showcase.
// Try not to edit the props of the container and box element

type Props = {
  exampleEntities: ExampleEntityDto[];
};

const DemoPage: NextPage<Props> = ({ exampleEntities }) => {
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <Demo buildTime={0} preLoadedData={exampleEntities} />
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data = await genExampleClient().get(0, PAGE_SHOW_SIZE, "");

  return {
    props: {
      // !This is a hack to get around undefined values in dataset
      exampleEntities: JSON.parse(JSON.stringify(data.results))
    }
  };
};

export default DemoPage;
