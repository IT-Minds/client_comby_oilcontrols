import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { useI18n } from "next-rosetta";
import { FC, useReducer } from "react";
import ListReducer from "react-list-reducer";
import { genRoleClient } from "services/backend/apiClients";
import { IRoleIdDto } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";

type Props = {
  cb: (s: IRoleIdDto) => void;
  preselectedValue?: DropdownType;
};

const UserRoleSelector: FC<Props> = ({ cb, preselectedValue }) => {
  const { t } = useI18n<Locale>();
  const [userRoles, dispatchUserRoles] = useReducer(ListReducer<IRoleIdDto>("id"), []);

  const { done } = usePagedFetched(
    "NOT_USED",
    (needle, size, _sortBy, skip) =>
      genRoleClient().then(client => client.getAllRole(needle, size, skip)),
    dispatchUserRoles,
    {
      pageSize: 1000
    }
  );

  return (
    <ComboSelect
      value={preselectedValue}
      options={userRoles
        .filter(x => x.name !== "SuperAdmin")
        .map(s => ({
          ...s,
          id: s.id.toString(),
          name: s.name
        }))}
      isLoading={!done}
      placeholder={t("userRoleSelector.selectUserRole") as string}
      onSelect={x => cb(userRoles.find(s => s.name === x.name))}
    />
  );
};

export default UserRoleSelector;
