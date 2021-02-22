import { Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import CreateRole from "components/CreateRole/CreateRole";
import CreateUser from "components/CreateUser/CreateUser";
import UserDetailsTable from "components/UserDetails/UserDetailsTable";
import { RefetchDataContext } from "contexts/RefetchDataContext";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";

const MyPage: NextPage = () => {
  const { t } = useI18n<Locale>();
  const [counter, setCounter] = useState(0);

  const refetchData = useCallback(() => {
    setCounter(c => c + 1);
  }, []);

  return (
    <VStack w="100%">
      <Heading>{t("users.users")}</Heading>
      <RefetchDataContext.Provider value={{ refetchData, count: counter }}>
        <HStack alignSelf="end">
          <CreateUser />
          <CreateRole />
        </HStack>
        <UserDetailsTable />
      </RefetchDataContext.Provider>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  let { table = {} } = await import(`../i18n/${locale}`);
  table = runTimeTable(locale, table);

  return {
    props: {
      table
    }
  };
};

export default MyPage;
