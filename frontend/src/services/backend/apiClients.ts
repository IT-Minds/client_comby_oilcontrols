import { api } from "./api";
import { ExampleEntityClient, HealthClient, RefillClient } from "./nswagts";
import { exampleClientOfflineData } from "./offline.data";

export const genExampleClient = (): Promise<ExampleEntityClient> =>
  api(ExampleEntityClient, exampleClientOfflineData);
export const genHealthClient = (): Promise<HealthClient> => api(HealthClient, []);

export const genRefillClient = (): Promise<RefillClient> => api(RefillClient, []);
