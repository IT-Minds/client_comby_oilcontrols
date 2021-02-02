import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { I18nProps } from "next-rosetta";
import { useEffect } from "react";

const LocalePage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/mytruck/[id]", "/mytruck/1");
  }, []);

  return <h1>Rest of the page</h1>;
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  return { props: { table } };
};

export default LocalePage;
