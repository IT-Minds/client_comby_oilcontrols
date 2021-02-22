import { UserTypeContext } from "contexts/UserTypeContext";
import { ComponentType, FC, useContext } from "react";
import { Action } from "services/backend/nswagts";

export const authGuardHOC = <P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  ...actions: Action[]
): ComponentType<P> => {
  const AuthComp: FC<P> = props => {
    const { activeUser } = useContext(UserTypeContext);

    if (actions.every(a => activeUser.currentRole.actions.includes(a))) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return AuthComp;
};
