import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { FC, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genRoleClient } from "services/backend/apiClients";
import { RoleDto } from "services/backend/nswagts";

type Props = {
  cb: (s: RoleDto) => void;
};

const UserRoleSelector: FC<Props> = ({ cb }) => {
  const [userRoles, dispatchUserRoles] = useReducer(ListReducer<RoleDto>("name"), []);

  {
    //TODO: use genUserClient
  }
  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genRoleClient().then(client => client.getRoles()),
    dispatchUserRoles,
    {
      pageSize: 1000
    }
  );

  return (
    <ComboSelect
      options={userRoles.map(s => ({
        ...s,
        id: s.name.toString(),
        name: s.name
      }))}
      isLoading={!done}
      placeholder="Select User Role"
      onSelect={x => cb(userRoles.find(s => s.name === x.name)}
    />
  );
};

export default UserRoleSelector;
