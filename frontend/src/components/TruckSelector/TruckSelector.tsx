import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useMemo, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genTruckClient } from "services/backend/apiClients";
import { ITruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  cb: (s: ITruckInfoIdDto) => void;
  value?: number;
};

const TruckSelector: FC<Props> = ({ cb, value }) => {
  const [trucks, dispatchData] = useReducer(ListReducer<ITruckInfoIdDto>("id"), []);

  const { done } = usePagedFetched<number>(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genTruckClient().then(client => client.getTrucks(needle, size, skip)),
    dispatchData
  );

  const existingTruck = useMemo(() => {
    return trucks.find(s => value === s.id);
  }, [trucks]);

  return (
    <ComboSelect
      options={trucks.map(s => ({
        ...s,
        id: s.id,
        name: s.name
      }))}
      isLoading={!done}
      placeholder="Select Truck"
      onSelect={x => cb(trucks.find(s => s.id === Number(x.id)))}
      value={
        existingTruck
          ? {
              ...existingTruck,
              id: existingTruck.id,
              name: existingTruck.name
            }
          : null
      }
    />
  );
};

export default TruckSelector;
