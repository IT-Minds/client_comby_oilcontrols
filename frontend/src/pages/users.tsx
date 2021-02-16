import { Divider, Heading, Text, useToast, VStack } from "@chakra-ui/react";
import CreateRoleComp from "components/CreateRole/CreateRoleComp";
import UserDetailsTable from "components/UserDetails/UserDetailsTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genRoleClient } from "services/backend/apiClients";
import { CreateRoleCommand, IRoleDto } from "services/backend/nswagts";

const MyPage: NextPage = () => {
  const toast = useToast();
  const createRole = useCallback(async (form: IRoleDto) => {
    const client = await genRoleClient();
    await client.createRole(new CreateRoleCommand({ role: form }));

    toast({
      title: "Create role successful",
      description: "Successful",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, []);

  return (
    <VStack w="100%">
      <Heading>USERS</Heading>
      <UserDetailsTable />;
      <Divider />
      <Text size="xl">CREATE ROLE</Text>
      <CreateRoleComp submitCallback={createRole} />
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);

  return {
    props: {
      table
    }
  };
};

export default MyPage;
