/* istanbul ignore file */

import EnvironmentSettings from "../types/EnvSettings";

const key = "EnvironmentSettings";

const isomorphicEnvSettings = (): EnvironmentSettings => {
  let envSettings: EnvironmentSettings;
  if (process.browser) {
    const esStr = window.sessionStorage.getItem(key);

    envSettings = JSON.parse(esStr);
  } else {
    envSettings = {
      buildId: process.env.BUILD_ID,
      backendUrl: process.env.BACKEND_URL,
      backendToken: process.env.BACKEND_API_TOKEN
    };
  }
  return envSettings;
};

export const setEnvSettings = (envSettings: EnvironmentSettings): void => {
  if (window) window.sessionStorage.setItem(key, JSON.stringify(envSettings));
};

export default isomorphicEnvSettings;
