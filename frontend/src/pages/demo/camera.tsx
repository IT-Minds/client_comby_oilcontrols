import { Box, Container } from "@chakra-ui/react";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        {/* <!-- CAMERA COMPONENT HERE--> */}
      </Box>
    </Container>
  );
};

export default DemoPage;
