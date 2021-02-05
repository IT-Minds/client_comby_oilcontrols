/* istanbul ignore file */
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { genAuthenticationClient } from "services/backend/apiClients";
import { AssignTokenCommand, IUserDto, UserTokenDto } from "services/backend/nswagts";

import { useEffectAsync } from "./useEffectAsync";

const TOKEN_STORAGE_KEY = "CombyStorageKey";

export enum AuthStage {
  CHECKING,
  AUTHENTICATED,
  UNAUTHENTICATED
}

export const useAuth = () => {
  const [authStage, setAuthStage] = useState(AuthStage.CHECKING);
  const [authCounter, setAuthCounter] = useState(0);
  const router = useRouter();

  useEffectAsync(async () => {
    const client = await genAuthenticationClient();
    const user = await client.checkAuth().catch(() => null);
    setAuthStage(user ? AuthStage.AUTHENTICATED : AuthStage.UNAUTHENTICATED);
  }, [authCounter]);

  const login = useCallback(async (userDto: IUserDto) => {
    console.log("LOGGING IN: ", userDto);

    const client = await genAuthenticationClient();

    const user: UserTokenDto = await client
      .login(
        new AssignTokenCommand({
          userDto
        })
      )
      .catch(() => null);

    if (!user) {
      return false;
    }
    setAuthStage(AuthStage.CHECKING);
    setAuthToken(user.token);
    setAuthCounter(c => c + 1);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthStage(AuthStage.CHECKING);
    setAuthToken("");
    setAuthCounter(c => c + 1);
    router.push("/");
  }, []);

  return { authStage, login, logout };
};

export const getAuthToken = (): string => {
  if (!process.browser) return null; // TODO Maybe use cookie with context read??
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  if (!process.browser) return; // TODO Maybe use cookie with context read??
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};
