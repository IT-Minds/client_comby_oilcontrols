import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useMemo, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genStreetClient } from "services/backend/apiClients";
import { StreetDto } from "services/backend/nswagts";

type Props = {
  cb: (s: StreetDto) => void;
  value?: string;
};

const StreetSelector: FC<Props> = ({ cb, value }) => {
  const [streets, dispatchStreets] = useReducer(ListReducer<StreetDto>("id"), []);

  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genStreetClient().then(client => client.get(needle, size, skip)),
    dispatchStreets,
    {
      pageSize: 1000
    }
  );

  const existingStreet = useMemo(() => {
    return streets.find(s => value.indexOf(s.name) === 0);
  }, [streets]);

  return (
    <ComboSelect
      options={streets.map(s => ({
        ...s,
        id: s.id.toString(),
        name: s.name
      }))}
      isLoading={!done}
      placeholder="Select Street"
      onSelect={x => cb(streets.find(s => s.id === Number.parseInt(x.id)))}
      value={
        existingStreet
          ? {
              ...existingStreet,
              id: existingStreet.id.toString(),
              name: existingStreet.name
            }
          : null
      }
    />
  );
};

export default StreetSelector;
