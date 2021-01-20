import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import LocaleMetaDataForm from "components/LocaleMetaDataForm/LocaleMetaDataForm";
import { NextPage } from "next";
import React from "react";

const DemoPage: NextPage = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <LocaleMetaDataForm />
      </Box>
    </Container>
  );
};

export default DemoPage;
