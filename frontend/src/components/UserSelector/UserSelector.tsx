import ComboSelect from "components/SortFilter/ComboSelect";
import { usePagedFetched } from "hooks/usePagedFetched";
import { useI18n } from "next-rosetta";
import { FC, useEffect, useReducer, useState } from "react";
import ListReducer from "react-list-reducer";
import { genUserClient } from "services/backend/apiClients";
import { IUserIdDto } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";

type Props = {
  cb: (u: IUserIdDto) => void;
  value?: number;
};

const UserSelector: FC<Props> = ({ cb, value }) => {
  const { t } = useI18n<Locale>();

  const [users, dispatchUsers] = useReducer(ListReducer<IUserIdDto>("id"), []);
  const [existingUser, setExistingUser] = useState<DropdownType>({ id: null, name: null });

  const { done } = usePagedFetched<number, IUserIdDto>(
    "",
    (needle, size, _, skip) =>
      genUserClient().then(client => client.getAllUser(needle, size, skip)),
    dispatchUsers,
    {}
  );

  useEffect(() => {
    if (value) {
      setExistingUser({ id: value.toString(), name: users.find(u => u.id === value)?.username });
    }
  }, [value]);

  return (
    <ComboSelect
      options={users.map(s => ({
        ...s,
        id: s.id.toString(),
        name: s.username
      }))}
      isLoading={!done}
      placeholder={t("userSelector.selectUser") as string}
      onSelect={x => cb(users.find(s => s.id === Number(x.id)))}
      value={existingUser ? existingUser : null}
    />
  );
};

export default UserSelector;
