import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import CreateUserComp from "components/CreateUser/CreateUserComp";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";
import { genUserClient } from "services/backend/apiClients";
import { CreateUserCommand, UpdateUserRolesCommand } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const createUser = useCallback(
    async (form: CreateUserCommand, role: string) => {
      awaitCallback(async () => {
        const client = await genUserClient();
        const id = await client.createUser(form);

        await client.updateUserRoles(
          id,
          new UpdateUserRolesCommand({
            role
          })
        );

        toast({
          title: "Create user successful",
          description: "Successful",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CreateUserComp submitCallback={(x, y) => createUser(x, y)} />
      </Box>
    </Container>
  );
};

export default DemoPage;
