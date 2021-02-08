import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import CreateRoleComp from "components/CreateRole/CreateRoleComp";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import React, { useCallback } from "react";
import { genRoleClient } from "services/backend/apiClients";
import { CreateRoleCommand, RoleDto } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const createRole = useCallback(
    async (form: RoleDto) => {
      awaitCallback(async () => {
        const client = await genRoleClient();
        await client.createRole(new CreateRoleCommand({ role: form }));

        toast({
          title: "Create role successful",
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
        <CreateRoleComp submitCallback={x => createRole(x)} />
      </Box>
    </Container>
  );
};

export default DemoPage;
