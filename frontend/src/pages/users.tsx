import UserDetailsTable from "components/UserDetails/UserDetailsTable";
import { GetStaticProps } from "next";
import { I18nProps } from "next-rosetta";

export default UserDetailsTable;

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);

  return {
    props: {
      table
    }
  };
};
