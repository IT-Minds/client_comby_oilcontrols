import { Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import CreateRole from "components/CreateRole/CreateRole";
import CreateUser from "components/CreateUser/CreateUser";
import UserDetailsTable from "components/UserDetails/UserDetailsTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";

const MyPage: NextPage = () => {
  const { t } = useI18n<Locale>();

  return (
    <VStack w="100%">
      <Heading>{t("users.users")}</Heading>
      <HStack alignSelf="end">
        <CreateUser />
        <CreateRole />
      </HStack>
      <UserDetailsTable />
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
