import { Box, Container } from "@chakra-ui/react";
import LocaleMetaDataForm from "components/LocaleMetaDataForm/LocaleMetaDataForm";
import { NextPage } from "next";
import React from "react";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <LocaleMetaDataForm id={"someId"}></LocaleMetaDataForm>
      </Box>
    </Container>
  );
};

export default DemoPage;
