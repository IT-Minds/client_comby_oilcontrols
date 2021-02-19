import "ts-array-ext/distinct";

import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { useI18n } from "next-rosetta";
import { FC, ReactText, useMemo, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genStreetClient } from "services/backend/apiClients";
import { IStreetDto } from "services/backend/nswagts";

type Props = {
  cb: (s: IStreetDto) => void;
  value?: ReactText;
};

const RegionSelector: FC<Props> = ({ cb, value }) => {
  const { t } = useI18n<Locale>();
  const [streets, dispatchStreets] = useReducer(ListReducer<IStreetDto>("id"), []);

  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genStreetClient().then(client => client.get(needle, size, skip)),
    dispatchStreets,
    {
      pageSize: 1000
    }
  );

  const existingRegion = useMemo(() => {
    const found = streets.find(s => value === s.regionId);
    return found
      ? {
          id: found.id,
          name: found.name
        }
      : found;
  }, [streets]);

  const getUniqueRegions = (streets: IStreetDto[]) => {
    const regions = streets.map(s => s.regionId).distinct();
    return regions;
  };

  return (
    <ComboSelect
      options={getUniqueRegions(streets).map(s => ({
        id: s,
        name: t("regionSelector.region") + " " + s
      }))}
      isLoading={!done}
      placeholder={t("regionSelector.selectRegion") as string}
      onSelect={x => cb(streets.find(s => s.id === Number(x.id)))}
      value={
        existingRegion
          ? {
              ...existingRegion,
              id: existingRegion.id,
              name: existingRegion.name
            }
          : null
      }
    />
  );
};

export default RegionSelector;
