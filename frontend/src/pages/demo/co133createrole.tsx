import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import CreateRoleComp from "components/CreateRole/CreateRoleComp";
import { useOffline } from "hooks/useOffline";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React, { useCallback } from "react";
import { genRoleClient } from "services/backend/apiClients";
import { CreateRoleCommand, IRoleDto } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const createRole = useCallback(
    async (role: IRoleDto) => {
      awaitCallback(async () => {
        const client = await genRoleClient();
        await client.createRole(new CreateRoleCommand({ role }));

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

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table } };
};

export default DemoPage;
