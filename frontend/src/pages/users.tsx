import UserDetailsTable from "components/UserDetails/UserDetailsTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";

const MyPage: NextPage = () => {
  return <UserDetailsTable></UserDetailsTable>;
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
