import AddLocationTriggerBtn from "components/LocaleMetaDataForm/AddLocationTriggerBtn";
import LocationList from "components/LocationList/LocationList";
import { useEffectAsync } from "hooks/useEffectAsync";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";
import { genLocationClient } from "services/backend/apiClients";
import { LocationDetailsIdDto, TankType } from "services/backend/nswagts";

const type = TankType.BUILDING;

const LocationPage: NextPage = () => {
  const [locations, setLocations] = useState<LocationDetailsIdDto[]>([]);

  useEffectAsync(async () => {
    const client = await genLocationClient();
    const locations = await client.getAll(type);
    setLocations(locations.results);
  }, []);

  return (
    <>
      <AddLocationTriggerBtn tankType={type} />
      <LocationList data={locations} />
    </>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  let { table = {} } = await import(`../../i18n/${locale}`);
  table = runTimeTable(locale, table);

  return {
    props: {
      table
    }
  };
};

export default LocationPage;
