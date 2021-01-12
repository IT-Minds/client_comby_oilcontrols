import { api } from "./api";
import { ExampleEntityClient, HealthClient } from "./nswagts";
import { exampleClientOfflineData } from "./offline.data";

export const genExampleClient = (): ExampleEntityClient =>
  api(ExampleEntityClient, exampleClientOfflineData);
export const genHealthClient = (): HealthClient => api(HealthClient, []);
