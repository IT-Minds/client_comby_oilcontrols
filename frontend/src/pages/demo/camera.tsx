import { Container, VStack } from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import { NextPage } from "next";
import { useState } from "react";

const DemoPage: NextPage = () => {
  const [imgSource, setImgSource] = useState(null);

  return (
    <Container maxW="xl" centerContent>
      <VStack>
        <CameraComp imgSource={setImgSource} />
        {imgSource && <img src={imgSource} alt=""></img>}
      </VStack>
    </Container>
  );
};

export default DemoPage;
