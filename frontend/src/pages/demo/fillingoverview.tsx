import { Box, Container, useToast } from "@chakra-ui/react";
import FillingOverviewComp from "components/FillingOverview/FillingOverviewComponent";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="100%" maxH="100%" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <FillingOverviewComp submitCallback={null}></FillingOverviewComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
