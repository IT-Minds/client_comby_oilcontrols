import { Box, Container } from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import { NextPage } from "next";
import { useState } from "react";

const DemoPage: NextPage = () => {
  const [imgSource, setImgSource] = useState(null);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CameraComp imgSource={setImgSource} />
      </Box>

      {imgSource && <img src={imgSource} alt=""></img>}
    </Container>
  );
};

export default DemoPage;
