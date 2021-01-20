import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genStreetClient } from "services/backend/apiClients";
import { StreetDto } from "services/backend/nswagts";

type Props = {
  cb: (s: StreetDto) => void;
};

const StreetSelector: FC<Props> = ({ cb }) => {
  const [streets, dispatchStreets] = useReducer(ListReducer<StreetDto>("id"), []);

  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genStreetClient().then(client => client.get(needle, size, skip)),
    dispatchStreets
  );

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
    />
  );
};

export default StreetSelector;
