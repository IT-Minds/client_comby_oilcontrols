import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genStreetClient } from "services/backend/apiClients";
import { StreetDto } from "services/backend/nswagts";

{
  //TODO: set UserDto
}
type Props = {
  cb: (s: StreetDto) => void;
};

const UserRoleSelector: FC<Props> = ({ cb }) => {
  {
    //TODO: set UserDto
  }
  const [userRoles, dispatchUserRoles] = useReducer(ListReducer<StreetDto>("id"), []);

  {
    //TODO: use genUserClient
  }
  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genStreetClient().then(client => client.get(needle, size, skip)),
    dispatchUserRoles,
    {
      pageSize: 1000
    }
  );

  return (
    <ComboSelect
      options={userRoles.map(s => ({
        ...s,
        id: s.id.toString(),
        name: s.name
      }))}
      isLoading={!done}
      placeholder="Select User Role"
      onSelect={x => cb(userRoles.find(s => s.id === Number.parseInt(x.id)))}
    />
  );
};

export default UserRoleSelector;
