import AddLocationTriggerBtn from "components/LocaleMetaDataForm/LocationCreationModal";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { TankType } from "services/backend/nswagts";

type Props = {
  //
};

const BuildingPage: NextPage<Props> = () => {
  return (
    <>
      <h1>Hello World</h1>
      <AddLocationTriggerBtn tankType={TankType.SHIP} />
    </>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale> & Props> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../i18n/${locale}`);

  return {
    props: {
      table
    }
  };
};

export default BuildingPage;
