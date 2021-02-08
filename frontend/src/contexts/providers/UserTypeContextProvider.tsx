import { UserTypeContext } from "contexts/UserTypeContext";
import { FC, useCallback, useEffect, useState } from "react";
import { UserType } from "types/UserType";

const STORAGE_KEY = "9u57sv3-user-type";

function setLocalStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // catch possible errors:
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  }
}

function getLocalStorage(key: string, initialValue?: unknown) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    // if error, return initial value
    return initialValue;
  }
}

import { useAuth } from "hooks/useAuth";
type Props = {
  logout: ReturnType<typeof useAuth>["logout"];
};

const UserTypeContextProvider: FC<Props> = ({ children, logout }) => {
  const [userType, setUserType] = useState<UserType>(() =>
    getLocalStorage(STORAGE_KEY, UserType.OFFICE_WORKER)
  );

  useEffect(() => {
    if (process.browser) {
      setUserType(getLocalStorage(STORAGE_KEY, UserType.OFFICE_WORKER));
    }
  }, []);

  useEffect(() => {
    setLocalStorage(STORAGE_KEY, userType);
  }, [userType]);

  const isType = useCallback(
    (ut: UserType) => {
      return userType === ut;
    },
    [userType]
  );

  return (
    <UserTypeContext.Provider
      value={{
        userType,
        setUserType,
        isType,
        logout
      }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export default UserTypeContextProvider;
