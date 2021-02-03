import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import CreateUserComp from "components/CreateUser/CreateUserComp";
import { CreateUserForm } from "components/CreateUser/CreateUserForm";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const createUser = useCallback(
    async (form: CreateUserForm) => {
    //   awaitCallback(async () => {
    //     const client = await genLocationClient();
    //     const newId = await (form.id
    //       ? client.updateMetaData(form.id, new UpdateLocationMetaDataCommand(form))
    //       : client.addNewLocation(new CreateLocationCommand(form)));

    //     await client.saveLocationImage(newId, { data: form.image, fileName: form.image.name });

    //     toast({
    //       title: "Filldata created/updated",
    //       description: "Successful",
    //       status: "success",
    //       duration: 9000,
    //       isClosable: true
    //     });
    //   }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CreateUserComp submitCallback={x => createUser(x)} />
      </Box>
    </Container>
  );
};

export default DemoPage;
