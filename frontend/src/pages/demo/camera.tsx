import { Box, Container } from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CameraComp buildTime={0} />
      </Box>
    </Container>
  );
};

export default DemoPage;
