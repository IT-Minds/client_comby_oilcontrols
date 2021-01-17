/* istanbul ignore file */
// !NOTE: If you are having build errors with this file missing, the backend is required to be built first
import fetch from "isomorphic-unfetch";
import isomorphicEnvSettings, { setEnvSettings } from "utils/envSettings";

import { AuthClient } from "./nswagts";

interface BaseClient {
  get?: () => Promise<unknown>;
}

type BaseConstructor<T> = {
  new (
    configuration: AuthClient,
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ): T & BaseClient;
};

export const api = async <T, U extends BaseConstructor<T>>(Client: U): Promise<T> => {
  let envSettings = isomorphicEnvSettings();

  if (envSettings === null && process.browser) {
    envSettings = await fetch("/api/getEnv").then(res => res.json());
    setEnvSettings(envSettings);
  }
  if (envSettings === null && !process.browser) {
    throw new Error("Environment settings null on server");
  }

  const initilizedClient = new Client(
    new AuthClient(envSettings.backendToken),
    envSettings.backendUrl,
    {
      fetch
    }
  );

  return initilizedClient;
};
