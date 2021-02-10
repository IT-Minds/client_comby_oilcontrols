/* istanbul ignore file */
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { genAuthenticationClient } from "services/backend/apiClients";
import {
  AssignTokenCommand,
  IAssignTokenCommand,
  IUserIdDto,
  UserIdDto,
  UserTokenDto
} from "services/backend/nswagts";

import { useEffectAsync } from "./useEffectAsync";

export const TOKEN_STORAGE_KEY = "CombyStorageKey";

export enum AuthStage {
  CHECKING,
  AUTHENTICATED,
  UNAUTHENTICATED
}

export const useAuth = () => {
  const [authStage, setAuthStage] = useState(AuthStage.CHECKING);
  const [authCounter, setAuthCounter] = useState(0);
  const [activeUser, setActiveUser] = useState<IUserIdDto>(null);
  const router = useRouter();

  const setCookie = useCallback((token: string) => {
    const d = new Date();
    d.setTime(d.getTime() + 14 * 24 * 60 * 60 * 1000);

    document.cookie = `${TOKEN_STORAGE_KEY}=${token}; expires=${d.toUTCString()}; path=/`;
  }, []);

  const deleteCookie = useCallback(() => {
    document.cookie = `${TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }, []);

  useEffectAsync(async () => {
    const client = await genAuthenticationClient();
    const user: UserIdDto = await client.checkAuth().catch(() => null);

    setActiveUser(user);

    setAuthStage(user ? AuthStage.AUTHENTICATED : AuthStage.UNAUTHENTICATED);
  }, [authCounter]);

  const login = useCallback(async (userDto: IAssignTokenCommand) => {
    const client = await genAuthenticationClient();

    const user: UserTokenDto = await client
      .login(new AssignTokenCommand(userDto))
      .catch(() => null);

    if (!user) {
      return false;
    }
    setAuthStage(AuthStage.CHECKING);
    setCookie(user.token);
    setAuthToken(user.token);
    setAuthCounter(c => c + 1);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthStage(AuthStage.CHECKING);
    deleteCookie();
    setAuthToken("");
    setAuthCounter(c => c + 1);
    router.push("/");
  }, []);

  return { authStage, login, logout, activeUser };
};

export const getAuthToken = (): string => {
  if (!process.browser) return process.env.AUTH_TOKEN; // TODO Maybe use cookie with context read??
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  if (!process.browser) return; // TODO Maybe use cookie with context read??
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};
