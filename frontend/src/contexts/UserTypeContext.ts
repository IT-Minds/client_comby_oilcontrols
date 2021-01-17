import { createContext, Dispatch, SetStateAction } from "react";
import { UserType } from "types/UserType";

type ContextType = {
  userType: UserType;
  setUserType: Dispatch<SetStateAction<UserType>>;
  isType: (ut: UserType) => boolean;
};

export const UserTypeContext = createContext<ContextType>(null);
