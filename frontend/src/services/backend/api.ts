// !NOTE: If you are having build errors with this file missing, the backend is required to be built first
import fetch from "isomorphic-unfetch";
import isomorphicEnvSettings from "utils/envSettings";

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

export const api = <T, U extends BaseConstructor<T>>(Client: U, offlineData?: unknown): T => {
  const envSettings = isomorphicEnvSettings();

  const initilizedClient = new Client(
    new AuthClient(envSettings.backendToken),
    envSettings.backendUrl,
    {
      fetch
    }
  );

  /**
   * This is mainly used for developing without a running backend. See [here](./offline.md)
   */
  const offline = process.env.NEXT_PUBLIC_OFFLINE === "true";
  if (initilizedClient.get && offline === true) {
    initilizedClient.get = () => Promise.resolve(offlineData);
  }

  return initilizedClient;
};
