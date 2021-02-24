import AddLocationTriggerBtn from "components/LocaleMetaDataForm/AddLocationTriggerBtn";
import LocationList from "components/LocationList/LocationList";
import { RefetchDataContext } from "contexts/RefetchDataContext";
import { useEffectAsync } from "hooks/useEffectAsync";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback, useReducer, useState } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genLocationClient } from "services/backend/apiClients";
import { LocationDetailsIdDto, TankType } from "services/backend/nswagts";

const type = TankType.SHIP;

const LocationPage: NextPage = () => {
  const [data, dataDispatch] = useReducer(ListReducer<LocationDetailsIdDto>("id"), []);

  const [counter, setCounter] = useState(0);

  const refetchData = useCallback(() => {
    setCounter(c => c + 1);
  }, []);

  useEffectAsync(async () => {
    const client = await genLocationClient();
    const locations = await client.getAll(type);

    dataDispatch({
      type: ListReducerActionType.Reset,
      data: locations.results
    });
  }, [counter]);

  return (
    <>
      <RefetchDataContext.Provider value={{ refetchData, count: counter }}>
        <AddLocationTriggerBtn tankType={type} />
        <LocationList data={data} />
      </RefetchDataContext.Provider>
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
