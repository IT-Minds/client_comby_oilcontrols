import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import UserCircle from "components/Menu/components/UserCircle";
import { RefetchDataContext } from "contexts/RefetchDataContext";
import { useEffectAsync } from "hooks/useEffectAsync";
import { usePagedFetched } from "hooks/usePagedFetched";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useContext, useReducer } from "react";
import ListReducer, { ListReducerActionType } from "react-list-reducer";
import { genUserClient } from "services/backend/apiClients";
import { IUserIdDto } from "services/backend/nswagts";

import DeleteUserModal from "./DeleteUserModal";
import UserDetailModal from "./UserDetailModal";

const UserDetailsTable: FC = () => {
  const { t } = useI18n<Locale>();
  const [data, dataDispatch] = useReducer(ListReducer<IUserIdDto>("id"), []);
  const { count } = useContext(RefetchDataContext);

  usePagedFetched<number, IUserIdDto>(
    "",
    (needle, size, _, skip) =>
      genUserClient().then(client => client.getAllUser(needle, size, skip)),
    dataDispatch,
    {}
  );

  const updateUser = useCallback((user: IUserIdDto) => {
    dataDispatch({
      type: ListReducerActionType.Update,
      data: user
    });
  }, []);

  useEffectAsync(async () => {
    const client = await genUserClient();
    const users = await client.getAllUser();

    dataDispatch({
      type: ListReducerActionType.Reset,
      data: users.results
    });
  }, [count]);

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th w={8}></Th>
          <Th>{t("users.userDetailsTable.userName")}</Th>
          <Th>{t("users.userDetailsTable.role")}</Th>
          <Th w={8}></Th>
        </Tr>
      </Thead>

      <Tbody>
        {data
          .filter(u => u.currentRole?.name !== "SuperAdmin")
          .map(user => (
            <Tr key={user.id}>
              <Td>
                <UserCircle size={8} user={user} />
              </Td>
              <Td>{user.username}</Td>
              <Td>{user.currentRole?.name}</Td>
              <Td>
                <HStack>
                  <UserDetailModal user={user} userCallback={x => updateUser(x)} />
                  <DeleteUserModal user={user} />
                </HStack>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default UserDetailsTable;
