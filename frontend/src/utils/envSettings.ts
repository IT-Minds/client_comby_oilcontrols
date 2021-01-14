/* istanbul ignore file */

import EnvironmentSettings from "../types/EnvSettings";
import { logger } from "./logger";

const key = "EnvironmentSettings";

const isomorphicEnvSettings = (): EnvironmentSettings => {
  let envSettings: EnvironmentSettings;

  logger.debug("isomorphicEnvSettings - isBrowser", process.browser);

  if (process.browser) {
    const esStr = window.sessionStorage.getItem(key);

    envSettings = JSON.parse(esStr);
  } else {
    envSettings = serverEnv();
  }
  return envSettings;
};

export const setEnvSettings = (envSettings: EnvironmentSettings): void => {
  if (window) window.sessionStorage.setItem(key, JSON.stringify(envSettings));
};

export const serverEnv = (): EnvironmentSettings =>
  <EnvironmentSettings>{
    buildId: process.env.BUILD_ID,
    backendUrl: process.env.BACKEND_URL,
    backendToken: process.env.BACKEND_API_TOKEN
  };

export default isomorphicEnvSettings;
