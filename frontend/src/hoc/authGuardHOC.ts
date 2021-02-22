import { UserTypeContext } from "contexts/UserTypeContext";
import { ComponentType, useContext } from "react";
import { Action } from "services/backend/nswagts";

export const authGuardHOC = <P extends object>(
  WrappedComponent: ComponentType<P>,
  ...actions: Action[]
) => {
  const { activeUser } = useContext(UserTypeContext);

  if (actions.every(a => activeUser.currentRole.actions.includes(a))) {
    return WrappedComponent;
  }

  return null;
};
