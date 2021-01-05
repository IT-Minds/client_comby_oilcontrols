import { api } from "./api";
import { ExampleEntityClient } from "./nswagts";
import { exampleClientOfflineData } from "./offline.data";

export const genExampleClient = (): ExampleEntityClient =>
  api(ExampleEntityClient, exampleClientOfflineData);
